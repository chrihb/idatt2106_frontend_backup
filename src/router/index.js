import { createRouter, createWebHistory } from 'vue-router'
import Base from "@/views/Base.vue";
import HomeView from "@/views/HomeView.vue";
import EmergencyStorage from "@/views/EmergencyStorage.vue";
import NewsView from "@/views/NewsView.vue";
import AccountView from "@/views/AccountView.vue";
import AdminView from "@/views/AdminView.vue";
import AboutUsView from "@/views/AboutUsView.vue";
import PrivacyPolicyView from "@/views/PrivacyPolicyView.vue";
import StorageView from "@/views/StorageView.vue";
import MapView from "@/views/MapView.vue";
import MyHomeView from "@/views/MyHomeView.vue";
import AuthBase from "@/views/AuthBase.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import PasswordResetRequest from "@/components/email/passwordReset/PasswordResetRequest.vue";
import EmailVerification from "@/components/email/EmailVerification.vue";
import PasswordResetNewPassword from "@/components/email/passwordReset/PasswordResetNewPassword.vue";
import SimpleCenteredComponent from "@/views/SimpleCenteredComponent.vue";
import {useUserStore} from "@/stores/userStore.js";
import ManageAdmins from "@/components/manageAdmins/ManageAdmins.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/", component: Base,
            children: [
                { path: "", component: HomeView },
                { path: "/news", component: NewsView },
                { path: "/account", component: AccountView, meta: { requiresAuth: true } },
                { path: "/admin-settings", component: AdminView, meta: { requiresAuth: true } },
                { path: "/manage-admins", component: ManageAdmins, meta: { requiresAuth: true } },
                { path: "/storage", component: EmergencyStorage, meta: { requiresAuth: true } },
                { path: "/about-us", component: AboutUsView },
                { path: "/privacy-policy", component: PrivacyPolicyView },
                { path: "/map", component: MapView },
                { path: "/my-home", component: MyHomeView, meta: { requiresAuth: true } },

            ],
        },
        {
            path: "/login", component: AuthBase,
            children: [
                { path: "/login", name: "Login", component: Login,},
                { path: "/register-account",name: "Register",component: Register },
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
    console.log("running auth check in router...");

    if (to.meta.requiresAuth) {
        console.log("Requires auth");
        await userStore.isAuthenticated();
        console.log("isAuth:", userStore.authenticated);
        if (!userStore.authenticated) {
            console.log("Not authenticated, redirecting to login");
            return next('/login');
        }
    }
    console.log("Route ok, proceeding...");
    next();
});


export default router
