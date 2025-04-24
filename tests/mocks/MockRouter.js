import {createRouter, createWebHistory} from "vue-router";

const mockRouter = (options = {}) => {
    const router = createRouter({
        history: createWebHistory(),
        routes: [],
        ...options // Merge additional options
    });

    router.isReady = () => Promise.resolve();

    return router;
};

export default mockRouter;
