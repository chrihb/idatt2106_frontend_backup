import axios from 'axios';

const addressDataCache = new Map();
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
let lastRequestTime = 0;

const withTimeoutAndAbort = (axiosRequest, ms) => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, ms);

    return axiosRequest(controller.signal).finally(() => clearTimeout(timeout));
};

function formatDisplayAddress(address = {}) {
    if (!address || typeof address !== 'object') return 'Address not found';

    const road = address.road || address.residential || address.pedestrian || address.footway || "";
    const house = address.house_number || address.house_name || "";

    const place =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.hamlet ||
        address.suburb ||
        address.city_district ||
        address.county ||
        "";

    const postcode = address.postcode || "";

    const mainLine = [road, house].filter(Boolean).join(" ").trim();
    const regionLine = [postcode, place].filter(Boolean).join(" ").trim();

    const full = [mainLine, regionLine].filter(Boolean).join(", ").trim();

    return full || "Address not found";
}

const fetchAndCacheAddressData = async (lat, lng) => {
    const cacheKey = `${lat},${lng}`;

    // Check in-memory
    if (addressDataCache.has(cacheKey)) {
        return addressDataCache.get(cacheKey);
    }

    // Check localStorage
    const stored = localStorage.getItem(`addr:${cacheKey}`);
    if (stored) {
        const parsed = JSON.parse(stored);
        addressDataCache.set(cacheKey, parsed);
        return parsed;
    }

    try {
        // Debounce: Ensure at least 1 second between API calls
        const now = Date.now();
        const waitTime = Math.max(0, 1000 - (now - lastRequestTime));
        if (waitTime > 0) {
            await delay(waitTime);
        }
        lastRequestTime = Date.now();

        // Call API with timeout protection
        const response = await withTimeoutAndAbort(
            (signal) =>
                axios.get('https://nominatim.openstreetmap.org/reverse', {
                    params: { lat, lon: lng, format: 'json' },
                    signal,
                }),
            5000 // 5s
        );

        const addr = response.data.address;
        addressDataCache.set(cacheKey, addr);
        localStorage.setItem(`addr:${cacheKey}`, JSON.stringify(addr));

        return addr;
    } catch (error) {
        console.error(`Location fetch failed (${lat}, ${lng}):`, error.message);
        return {};
    }
};

const getAddress = async (lat, lng, { brief }) => {
    const addr = await fetchAndCacheAddressData(lat, lng);

    if (brief) return addr.road || addr.residential || '';
    return formatDisplayAddress(addr);
};

const getCoordinates = async (address) => {
    try {
        // First, try with full address
        let response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                street: address.street,
                postalcode: address.postalcode,
                city: address.city,
                format: 'json',
            },
        });

        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lon: parseFloat(response.data[0].lon),
                status: 'full',
            };
        }

        console.warn('Street address not found, searching by postal code and city...');

        // Then try with just postal code and city
        response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                postalcode: address.postalcode,
                city: address.city,
                format: 'json',
            },
        });

        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lon: parseFloat(response.data[0].lon),
                status: 'partial',
            };
        }

        return { status: 'not found' };
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return { status: 'not found' };
    }
};

function debounceAsync(fn, delay) {
    let timeout;
    let resolveQueue = [];

    return function debounced(...args) {
        clearTimeout(timeout);
        return new Promise((resolve) => {
            resolveQueue.push(resolve);
            timeout = setTimeout(async () => {
                try {
                    const result = await fn(...args);
                    resolveQueue.forEach((res) => res(result));
                } catch (err) {
                    resolveQueue.forEach((res) => res([])); // resolve with empty array on error
                } finally {
                    resolveQueue = [];
                }
            }, delay);
        });
    };
}

const fetchAndFormatSuggestions = async (query) => {
    if (!query || query.length < 5) {
        return [];
    }

    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: query,
                format: 'json',
                addressdetails: 1,
                limit: 5,
                countrycodes: 'no',
            },
        });

        return response.data
            .map((item) => {
                const { address = {}, lat, lon } = item;

                return {
                    address,
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    displayName: formatDisplayAddress(address),
                };
            })
            .filter((s) => s.displayName && s.displayName.length > 1);
    } catch (error) {
        console.error("Error fetching address suggestions:", error);
        return [];
    }
};

export const getAddressSuggestions = debounceAsync(fetchAndFormatSuggestions, 1000);

export { getAddress, getCoordinates };
