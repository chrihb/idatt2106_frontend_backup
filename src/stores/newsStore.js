import { defineStore } from 'pinia';

export const useNewsStore = defineStore('news', {
    state: () => ({
        articles: [],
    }),

    actions: {
        addNews(newArticle) {
            this.articles.push(newArticle);
        },
        clearNews() {
            this.articles = [];
        },
    }
});
