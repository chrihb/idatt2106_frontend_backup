import { createRouter, createWebHistory } from "vue-router";
import Base from "@/views/Base.vue";
import HomeView from "@/views/HomeView.vue";
import NewsView from "@/views/NewsView.vue";
import AccountView from "@/views/AccountView.vue";
import AboutUsView from "@/views/AboutUsView.vue";
import HouseholdOptionsView from "@/views/HouseholdOptionsView.vue";
import HouseholdListView from "@/views/HouseholdListView.vue";

const mockRouter = (options = {}) => {
    return createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: "/",
                component: Base,
                children: [
                    { path: "", component: HomeView },
                    { path: "/news", component: NewsView },
                    { path: "/account", component: AccountView, meta: { requiresAuth: true } },
                    { path: "/about-us", component: AboutUsView },
                    { path: "/household/options", component: HouseholdOptionsView },
                    { path: "/household/list", component: HouseholdListView, meta: { requiresHousehold: true } },
                ],
            },
        ],
        ...options,
    });
};

export default mockRouter;
