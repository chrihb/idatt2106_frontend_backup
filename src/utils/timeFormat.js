export const timeSinceEvent = (timestamp) => {
    const isoString = timestamp.replace(' ', 'T').split('.')[0]; // Remove fractional seconds
    const eventTime = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - eventTime) / 1000);

    const intervals = [
        { singular: "år", plural: "år", seconds: 31536000 },
        { singular: "måned", plural: "måneder", seconds: 2592000 },
        { singular: "dag", plural: "dager", seconds: 86400 },
        { singular: "time", plural: "timer", seconds: 3600 },
        { singular: "minutt", plural: "minutter", seconds: 60 },
        { singular: "sekund", plural: "sekunder", seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            const label = count === 1 ? interval.singular : interval.plural;
            return `${count} ${label} siden`;
        }
    }

    return "akkurat nå";
};
