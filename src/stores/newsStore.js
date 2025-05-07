import { defineStore } from 'pinia';

export const useNewsStore = defineStore('news', {
    state: () => ({
        articles: [],
        noNewsFound: false,
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
