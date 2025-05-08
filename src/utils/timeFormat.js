export const timeSinceEvent = (timestamp) => {
    // Replace space with 'T' to make it ISO 8601 compatible
    const isoString = timestamp.replace(' ', 'T').split('.')[0]; // Remove fractional seconds
    const eventTime = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - eventTime) / 1000);

    const intervals = [
        { label: "år", seconds: 31536000 },
        { label: "måned", seconds: 2592000 },
        { label: "dag", seconds: 86400 },
        { label: "time", seconds: 3600 },
        { label: "minutt", seconds: 60 },
        { label: "sekund", seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? (interval.label === "måned" ? "er" : "er") : ""} siden`;
        }
    }

    return "akkurat nå";
};