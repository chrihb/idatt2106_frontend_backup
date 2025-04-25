import { useNewsStore } from "@/stores/newsStore.js";

export function mockNewsData() {
    const newsStore = useNewsStore();
    const newsMock = [
        {
            title: "Breaking News: Major Event Happens",
            content: "Details about the major event that just happened.",
            date: "2023-10-01",
            time: "10:00",
            severity: "high",
            location: "New York",
        },
        {
            title: "Local News: Community Event Announced",
            content: "Information about an upcoming community event.",
            date: "2023-10-02",
            time: "12:00",
            severity: "high",
            location: "Los Angeles",
        },
        {
            title: "Community Event Announced",
            content: "Details about a community event that is happening soon.",
            date: "2023-10-03",
            time: "15:26",
            severity: "medium",
            location: "Chicago",
        },
        {
            title: "Tech News: New Gadget Released",
            content: "A new gadget has been released to the market.",
            date: "2023-10-04",
            time: "09:00",
            severity: "low",
            location: "San Francisco",
        },
        {
            title: "Sports Update: Team Wins Championship",
            content: "Details about the championship game and the winning team.",
            date: "2023-10-05",
            time: "20:00",
            severity: "medium",
            location: "Miami",
        },
        {
            title: "Weather Alert: Storm Approaching",
            content: "A storm is expected to hit the area soon.",
            date: "2023-10-06",
            time: "14:00",
            severity: "high",
            location: "Houston",
        },
        {
            title: "Health News: New Study Released",
            content: "A new study has been published with interesting findings.",
            date: "2023-10-07",
            time: "08:00",
            severity: "low",
            location: "Boston",
        },
        {
            title: "Travel Update: New Destination Added",
            content: "A new travel destination has been added to the list.",
            date: "2023-10-08",
            time: "11:00",
            severity: "low",
            location: "Seattle",
        },
        {
            title: "Finance News: Market Update",
            content: "The stock market has seen significant changes today.",
            date: "2023-10-09",
            time: "16:00",
            severity: "medium",
            location: "Chicago",
        },
        {
            title: "Entertainment: Movie Premiere Announced",
            content: "A new movie premiere has been announced for next week.",
            date: "2023-10-10",
            time: "19:00",
            severity: "low",
            location: "Los Angeles",
        }
    ];

    for (let newsItem of newsMock) {
        newsStore.addNews(newsItem);
    }
}
