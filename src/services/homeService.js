import { useHomeStore } from "@/stores/homeStore.js";

export function mockHomeData() {
    const homeStore = useHomeStore();
    const homeMock = [
        {
            name: "John Doe",
            location: "Home",
            isHome: true,
        },
        {
            name: "Jane Smith",
            location: "Oslo",
            isHome: false,
        },
        {
            name: "Alice Johnson",
            location: "Home",
            isHome: true,
        },
        {
            name: "Bob Brown",
            location: "Stavanger",
            isHome: false,
        },
    ];

    for (let homeItem of homeMock) {
        homeStore.addMember(homeItem);
    }
    homeStore.setAddress("123 Main St, Oslo");
    homeStore.nearest.shelter = {
        address: "Oslo Bomb Shelter",
        distance: 1.2,
        location: {
            lat: 59.9139,
            lng: 10.7522,
        },
    };
    homeStore.nearest.defib = {
        address: "Oslo Defibrillator",
        distance: 0.5,
        location: {
            lat: 59.9140,
            lng: 10.7523,
        },
    };
    homeStore.nearest.hospital = {
        address: "Oslo General Hospital",
        distance: 2.5,
        location: {
            lat: 59.9123,
            lng: 10.7510,
        },
    };
}
