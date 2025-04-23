import { createRouter, createWebHistory } from 'vue-router'
import Base from "@/views/Base.vue";
import HomeView from "@/views/HomeView.vue";
import EmergencyStorage from "@/views/EmergencyStorage.vue";
import AccountView from "@/views/AccountView.vue";

const BASE_URL = import.meta.env.BASE_URL;

const router = createRouter({
    history: createWebHistory(BASE_URL),
    routes: [
        {
            path: "/", component: Base,
            children: [
                { path: "", component: HomeView },
                { path: "/account", component: AccountView },
                { path: "emergency-storage", component: EmergencyStorage },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    // Perform any global navigation guards here
    next();
});

export default router
