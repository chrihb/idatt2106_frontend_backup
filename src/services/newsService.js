import { useNewsStore } from "@/stores/newsStore.js";
import axios from "axios";

/**
 * Fetches news articles from the backend and updates the news store.
 * @returns {Promise<void>} news articles
 */
export const getNews = async () => {
    const newsStore = useNewsStore();
    try {
        // TODO: the last slash will be removed in the backend
        const response = await axios.get(`${window.backendURL}/api/news/`);
        const newsData = response.data;

        if (Array.isArray(newsData)) {
            newsStore.clearNews(); // Clear existing news before adding new ones
            for (let newsItem of newsData) {
                newsStore.addNews(newsItem);
            }
            newsStore.noNewsFound = false; // Reset noNewsFound if news is found
        } else {
            console.error("Invalid news data format:", newsData);
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            newsStore.noNewsFound = true; // Set no news flag
        } else {
            console.error("Error fetching news:", error);
        }
        newsStore.clearNews();
    }
};

export const getNewsByDistrict = async (district) => {
    const newsStore = useNewsStore();
    try {
        const response = await axios.get(`${window.backendURL}/api/news/district/${district}`);
        const newsData = response.data;

        if (Array.isArray(newsData)) {
            newsStore.clearNews(); // Clear existing news before adding new ones
            for (let newsItem of newsData) {
                newsStore.addNews(newsItem);
            }
            newsStore.noNewsFound = false; // Reset noNewsFound if news is found
        } else {
            console.error("Invalid news data format:", newsData);
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            newsStore.noNewsFound = true; // Set noNewsFound to true if no news is found
        }
        else {
            console.error("Error fetching news:", error);
        }
        newsStore.clearNews();
    }
}

