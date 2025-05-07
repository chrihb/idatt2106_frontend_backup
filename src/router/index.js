import { createRouter, createWebHistory } from 'vue-router'
import Base from "@/views/Base.vue";
import HomeView from "@/views/HomeView.vue";
import EmergencyStorage from "@/views/EmergencyStorage.vue";
import NewsView from "@/views/NewsView.vue";
import AccountView from "@/views/AccountView.vue";
import AboutUsView from "@/views/AboutUsView.vue";
import PrivacyPolicyView from "@/views/PrivacyPolicyView.vue";
import MapView from "@/views/MapView.vue";
import MyHomeView from "@/views/MyHomeView.vue";
import AuthBase from "@/views/AuthBase.vue";
import Login from "@/components/login/Login.vue";
import Register from "@/components/login/Register.vue";
import PasswordResetRequest from "@/components/email/passwordReset/PasswordResetRequest.vue";
import EmailVerification from "@/components/email/EmailVerification.vue";
import PasswordResetNewPassword from "@/components/email/passwordReset/PasswordResetNewPassword.vue";
import SimpleCenteredComponent from "@/views/SimpleCenteredComponent.vue";
import {useUserStore} from "@/stores/userStore.js";
import AdminRegister from "@/components/login/AdminRegister.vue";
import JoinCreateHousehold from "@/components/joinHousehold/Options.vue";
import StorageListView from '@/views/StorageListView.vue';
import HouseholdListView from "@/views/HouseholdListView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/", component: Base,
            children: [
                { path: "", component: HomeView },
                { path: "/news", component: NewsView },
                { path: "/account", component: AccountView, meta: { requiresAuth: true } },
                { path: "/storage", meta: { requiresAuth: true },
                    children: [
                        { path: "list", component: StorageListView, meta: { requiresHousehold: true } },
                        { path: ":id", component: EmergencyStorage, meta: { requiresHousehold: true }, props: true },
                    ]},
                { path: "/household", meta: { requiresAuth: true },
                    children: [
                        { path: "options", component: JoinCreateHousehold },
                        { path: "list", component: HouseholdListView, meta: { requiresHousehold: true } },
                        { path: ":id", component: MyHomeView, meta: { requiresHousehold: true }, props: true },
                    ]},
                { path: "/about-us", component: AboutUsView },
                { path: "/privacy-policy", component: PrivacyPolicyView },
                { path: "/map", component: MapView },
            ],
        },
        {
            path: "/", component: AuthBase,
            children: [
                { path: "/login", name: "Login", component: Login,},
                { path: "/register-account", name: "Register",component: Register },
                { path: "/register-admin", name: "Register Admin",component: AdminRegister, meta: { requiresAuth: true } },
            ],
        },
        {
            path: "/", component: SimpleCenteredComponent,
            children: [
                { path: "/password-reset-request", name: "PasswordResetRequest", component: PasswordResetRequest },
                { path: "/password-reset/:token", name: "PasswordReset", component: PasswordResetNewPassword },
                { path: "/email-verification/:token", name: "EmailVerification", component: EmailVerification },

            ]
        },
    ],

});

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();


    if (!to.meta.requiresAuth && !to.meta.requiresHousehold) {
        return next();
    }

    if (!userStore.token) {
        const redirectTo = to.fullPath
        return next({
            path: '/login',
            query: { redirect: redirectTo }
        })
    }

    await userStore.isAuthenticated();

    if (userStore.authenticated && !to.meta.requiresHousehold) {
        return next();
    }

    if (!userStore.householdId || userStore.householdId.length === 0) {
        return next('/household/options');
    }

    next()
});

export default router
