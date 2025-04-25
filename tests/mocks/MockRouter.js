import { createRouter, createWebHistory } from "vue-router";

const mockRouter = (options = {}) => {
    return createRouter({
        history: createWebHistory(),
        routes: [],
        ...options,
    });
};

export default mockRouter;
