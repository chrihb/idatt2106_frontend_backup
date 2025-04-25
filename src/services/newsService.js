import { useNewsStore } from "@/stores/newsStore.js";

export function mockNewsData() {
    const newsStore = useNewsStore();
    const newsMock = [
        {
            title: "Breaking News: Major Event Happens",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst.",
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

