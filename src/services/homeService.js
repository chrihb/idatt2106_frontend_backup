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
}

