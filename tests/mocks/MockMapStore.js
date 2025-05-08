const mockMapStore = () => {
    return {
        centerMapOnSpecificLocation: vi.fn(),
        map: {
            addLayer: vi.fn(),
            removeLayer: vi.fn(),
        },
    };
};

export default mockMapStore;
