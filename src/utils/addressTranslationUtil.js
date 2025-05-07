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


    if (brief) return addr.road
    return `${addr.road} ${addr.house_number || ''}, ${addr.postcode}  ${addr.city || addr.town || addr.village}` || 'Address not found';
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

let debounceTimeout;
const getAddressSuggestions = async (query) => {

    return new Promise((resolve) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            try {
                const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: query,
                        format: 'json',
                        addressdetails: 1,
                        limit: 5,
                        countrycodes: 'no'
                    },
                });

                const suggestions = response.data.map((item) => ({
                    address: item.address,
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon),
                }));

                resolve(suggestions);
            } catch (error) {
                console.error('Error fetching address suggestions:', error);
                resolve([]);
            }
        }, 1000); // 1 second delay
    });
};


export { getAddress, getCoordinates, getAddressSuggestions };

