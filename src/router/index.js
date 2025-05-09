import {createRouter, createWebHistory} from 'vue-router'
import Base from "@/views/Base.vue";
import HomeView from "@/views/HomeView.vue";
import EmergencyStorage from "@/views/EmergencyStorage.vue";
import NewsView from "@/views/NewsView.vue";
import AccountView from "@/views/AccountView.vue";
import AdminSettings from "@/components/admin/AdminSettings.vue";
import AboutUsView from "@/views/AboutUsView.vue";
import PrivacyPolicyView from "@/views/PrivacyPolicyView.vue";
import MapView from "@/views/MapView.vue";
import MyHomeView from "@/views/MyHomeView.vue";
import AuthBase from "@/views/AuthBase.vue";
import Login from "@/components/login/Login.vue";
import Register from "@/components/login/Register.vue";
import PasswordResetRequest
    from "@/components/email/passwordReset/PasswordResetRequest.vue";
import EmailVerification from "@/components/email/EmailVerification.vue";
import PasswordResetNewPassword
    from "@/components/email/passwordReset/PasswordResetNewPassword.vue";
import SimpleCenteredComponent from "@/views/SimpleCenteredComponent.vue";
import {useUserStore} from "@/stores/userStore.js";
import ManageAdmins from "@/components/manageAdmins/ManageAdmins.vue";
import AdminRegister from "@/components/login/AdminRegister.vue";
import JoinCreateHousehold from "@/components/joinHousehold/Options.vue";
import CreateEmergencyZone
    from "@/components/admin/map/CreateEmergencyZone.vue";
import CreateNews from "@/components/admin/news/CreateNews.vue";
import UpdateNews from "@/components/admin/news/UpdateNews.vue";
import DeleteNews from "@/components/admin/news/DeleteNews.vue";
import News from "@/components/admin/news/News.vue";
import StorageListView from '@/views/StorageListView.vue';
import HouseholdListView from "@/views/HouseholdListView.vue";
import AdminAuthBase from "@/views/AdminAuthBase.vue";
import AdminLogin from "@/components/login/AdminLogin.vue";
import UpdateEmergencyZoneView from "@/views/UpdateEmergencyZoneView.vue";
import UpdateMarkerView from "@/views/UpdateMarkerView.vue";
import HouseholdOptionsView from "@/views/HouseholdOptionsView.vue";
import AdminSetPassword from "@/components/login/AdminSetPassword.vue";
import AdminResetPassword from "@/components/login/AdminResetPassword.vue";
import GeneralInfoView from "@/views/GeneralInfo/GeneralInfoView.vue";
import BeforeCrisis from '@/views/GeneralInfo/BeforeCrisis.vue';
import DuringCrisis from '@/views/GeneralInfo/DuringCrisis.vue';
import AfterCrisis from '@/views/GeneralInfo/AfterCrisis.vue';

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
                { path: "/household", component: HouseholdOptionsView, meta: { requiresAuth: true },
                    children: [
                        { path: "options", component: Options },
                        { path: "list", component: HouseholdListView, meta: { requiresHousehold: true } },
                    ]},
                { path: "/household/:id", component: MyHomeView, meta: { requiresHousehold: true, requiresAuth: true }, props: true },
                { path: "/admin-settings", component: AdminSettings,
                    children: [
                        { path: "adminEmergencyZone", component: UpdateEmergencyZoneView },
                        { path: "adminEmergencyUtilities", component: UpdateMarkerView },
                        { path: "createNews", component: CreateNews },

                        { path: "news", component: News },
                        { path: "deleteNews", component: DeleteNews },
                    ]
                },
                { path: "/about-us", component: AboutUsView },
                { path: "/privacy-policy", component: PrivacyPolicyView },
                { path: "/general-info", component: GeneralInfoView, },
                { path: "/before-crisis", component: BeforeCrisis, },
                { path: "/during-crisis", component: DuringCrisis,},
                { path: "/after-crisis", component: AfterCrisis, },
                { path: "/map", component: MapView },
                { path: "/my-home", component: MyHomeView, meta: { requiresAuth: true, requiresHousehold: true } },

                { path: "/manage-admins", component: ManageAdmins, meta: { requiresSuperUser: true } },
                { path: "/admin-settings", component: AdminSettings, meta: { requiresAdmin: true },
                    children: [
                        { path: "createEmergencyZone", component: CreateEmergencyZone },
                        { path: "createMarker", component: UpdateMarkerView },
                        { path: "createNews", component: CreateNews },
                        { path: "updateNews/:caseId", component: UpdateNews, props: true },
                        { path: "deleteNews/:caseId", component: DeleteNews, props: true },
                    ]
                },

            ],
        },
        {
            path: "/", component: AuthBase,
            children: [
                { path: "/login", name: "Login", component: Login,},
                { path: "/register-account", name: "Register",component: Register },
            ],
        },
        {
            path: "/", component: AdminAuthBase,
            children: [
                { path: "/admin-login", name: "AdminLogin", component: AdminLogin, },
            ]
        },
        {
            path: "/", component: SimpleCenteredComponent,
            children: [
                { path: "/admin-activation", name: "AdminActivation", component: AdminSetPassword },
                { path: "/admin-password-reset", name: "AdminPasswordReset", component: AdminResetPassword },
                { path: "/password-reset-request", name: "PasswordResetRequest", component: PasswordResetRequest },
                { path: "/password-reset/:token", name: "PasswordReset", component: PasswordResetNewPassword },
                { path: "/email-verification/:token", name: "EmailVerification", component: EmailVerification },

            ]
        },
    ],

});

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();

    const requiresAdmin = to.path.startsWith('/admin-settings') ||
        to.path.startsWith('/manage-admins');

    if (requiresAdmin) {
        if (!userStore.isAdmin) {
            return next('/');
        }
    }

    const requiresSuperUser = to.path.startsWith('/manage-admins');
    if (requiresSuperUser) {
        if (!userStore.isSuperUser) {
            return next('/');
        }
    }

    if (!to.meta.requiresAuth && !to.meta.requiresHousehold) {
        return next();
    }

    if (!userStore.token) {
        const redirectTo = to.fullPath;
        return next({
            path: '/login',
            query: { redirect: redirectTo }
        });
    }

    await userStore.isAuthenticated();

    if (userStore.authenticated && !to.meta.requiresHousehold) {
        return next();
    }

    if (!userStore.householdId || userStore.householdId.length === 0) {
        return next('/household/options');
    }

    if (
        to.path === '/household/list' &&
        userStore.householdId.length === 1 &&
        userStore.householdId[0].id
    ) {
        return next(`/household/${userStore.householdId[0].id}`);
    }

    if (
        to.path === '/storage/list' &&
        userStore.householdId.length === 1 &&
        userStore.householdId[0].id
    ) {
        return next(`/storage/${userStore.householdId[0].id}`);
    }

    next();
});

export default router
