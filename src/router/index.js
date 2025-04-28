import { createRouter, createWebHistory } from 'vue-router'
import Base from "@/views/Base.vue";
import HomeView from "@/views/HomeView.vue";
import EmergencyStorage from "@/views/EmergencyStorage.vue";
import NewsView from "@/views/NewsView.vue";
import AccountView from "@/views/AccountView.vue";
import AboutUsView from "@/views/AboutUsView.vue";
import PrivacyPolicyView from "@/views/PrivacyPolicyView.vue";
import StorageView from "@/views/StorageView.vue";
import MapView from "@/views/MapView.vue";
import MyHomeView from "@/views/MyHomeView.vue";
import AuthBase from "@/views/AuthBase.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import PasswordReset from "@/components/PasswordReset.vue";
import EmailVerification from "@/components/email/EmailVerification.vue";
import SimpleCenteredComponent from "@/views/SimpleCenteredComponent.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/", component: Base,
            children: [
                { path: "", component: HomeView },
                { path: "/news", component: NewsView },
                { path: "/account", component: AccountView },
                { path: "/emergency-storage", component: EmergencyStorage },
                { path: "/about-us", component: AboutUsView },
                { path: "/privacy-policy", component: PrivacyPolicyView },
                { path: "/storage", component: StorageView },
                { path: "/map", component: MapView },
                { path: "/my-home", component: MyHomeView },
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
                { path: "/password-reset", name: "PasswordReset", component: PasswordReset },
                { path: "/email-verification/:token", name: "EmailVerification", component: EmailVerification },

            ]
        },
    ],

});

router.beforeEach((to, from, next) => {
    // Perform any global navigation guards here
    next();
});

export default router
