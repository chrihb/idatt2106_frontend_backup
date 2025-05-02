import { useNewsStore } from "@/stores/newsStore.js";
import axios from "axios";

/**
 * Fetches news articles from the backend and updates the news store.
 * @returns {Promise<void>} news articles
 */
export const getNews = async () => {
    const newsStore = useNewsStore();
    try {
        const response = await axios.get(`${window.backendURL}/api/news`);
        const newsData = response.data;

        if (Array.isArray(newsData)) {
            newsStore.clearNews(); // Clear existing news before adding new ones
            // Flatten the nested array structure and add each news item
            newsData.flat().forEach(newsItem => {
                newsStore.addNews(newsItem);
            });
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

/**
 * Fetches news articles by district from the backend and updates the news store.
 * @param {string} district - The district to filter news by.
 * @returns {Promise<void>} news articles
 */
export const getNewsByDistrict = async (district) => {
    const newsStore = useNewsStore();
    try {
        const response = await axios.get(`${window.backendURL}/api/news/district/${district}`);
        const newsData = response.data;

        if (Array.isArray(newsData)) {
            newsStore.clearNews(); // Clear existing news before adding new ones
            // Flatten the nested array structure and add each news item
            newsData.flat().forEach(newsItem => {
                newsStore.addNews(newsItem);
            });
            newsStore.noNewsFound = false; // Reset noNewsFound if news is found
        } else {
            console.error("Invalid news data format:", newsData);
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            newsStore.noNewsFound = true; // Set noNewsFound to true if no news is found
        } else {
            console.error("Error fetching news by district:", error);
        }
        newsStore.clearNews();
    }
};
/**
 * Fetches case details by caseId from the backend.
 * @param {string} caseId - The ID of the case to fetch.
 * @returns {Promise<Array>} case details
 */
export const getCaseDetails = async (caseId) => {
    try {
        const response = await axios.get(`${window.backendURL}/api/news/${caseId}`);
        const caseDetails = response.data;

        if (Array.isArray(caseDetails)) {
            return caseDetails; // Return the array of case details
        } else {
            console.error("Invalid case details format:", caseDetails);
        }
    } catch (error) {
        console.error(`Error fetching case details for caseId ${caseId}:`, error);
        throw error;
    }
};
