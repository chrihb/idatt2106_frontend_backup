import { createRouter, createWebHistory } from 'vue-router'
import Base from "@/views/Base.vue";
import HomeView from "@/views/HomeView.vue";
import AccountView from "@/views/AccountView.vue";
import AboutUsView from "@/views/AboutUsView.vue";
import PrivacyPolicyView from "@/views/PrivacyPolicyView.vue";

const BASE_URL = import.meta.env.BASE_URL;

const router = createRouter({
    history: createWebHistory(BASE_URL),
    routes: [
        {
            path: "/", component: Base,
            children: [
                { path: "", component: HomeView },
                { path: "/account", component: AccountView },
                { path: "/about-us", component: AboutUsView },
                { path: "/privacy-policy", component: PrivacyPolicyView },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    // Perform any global navigation guards here
    next();
});

export default router
