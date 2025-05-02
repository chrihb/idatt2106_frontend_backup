import { ref } from "vue";
import { HomeIcon, ArchiveBoxIcon, MapIcon, UserGroupIcon, DocumentTextIcon,
    BellIcon, MapPinIcon, UserPlusIcon, CogIcon } from "@heroicons/vue/24/solid/index.js";

export const toggleableSettings = ref([
    {
        id: 8,
        description: "account-settings.enable-notifications",
        toggleState: false,
        adminNeeded: false,
        superAdminNeeded: false,
    },
    {
        id: 9,
        description: "account-settings.enable-position-sharing",
        toggleState: false,
        adminNeeded: false,
        superAdminNeeded: false,
    },
    {
        id: 10,
        description: "account-settings.show-storage-on-frontpage",
        toggleState: false,
        adminNeeded: false,
        superAdminNeeded: false,
    },
    {
        id: 11,
        description: "account-settings.show-household-on-frontpage",
        toggleState: false,
        adminNeeded: false,
        superAdminNeeded: false,
    }
]);

export const routedSettings = ref([
    {
        id: 1,
        description: "account-settings.manage-storages",
        icon: "storage",
        route: "/storage",
        adminNeeded: false,
        superAdminNeeded: false,
    },
    {
        id: 2,
        description: "account-settings.manage-households",
        icon: "home",
        route: "/household",
        adminNeeded: false,
        superAdminNeeded: false,
    },
    {
        id: 3,
        description: "account-settings.find-assembling-areas",
        icon: "map",
        route: "/map",
        adminNeeded: true,
        superAdminNeeded: false,
    },
    {
        id: 4,
        description: "account-settings.manage-emergency-groups",
        icon: "group",
        route: "/emergency-groups",
        adminNeeded: false,
        superAdminNeeded: true,
    },
    {
        id: 5,
        description: "account-settings.experience-journal",
        icon: "journal",
        route: "/experience-journal",
        adminNeeded: false,
        superAdminNeeded: false,
    },
    {
        id: 6,
        description: "account-settings.admin-settings",
        icon: "settings",
        route: "/admin-settings",
        adminNeeded: true,
        superAdminNeeded: false,
    },
    {
        id: 7,
        description: "account-settings.manage-admins",
        icon: "group",
        route: "/manage-admins",
        adminNeeded: false,
        superAdminNeeded: true,
    }
]);


export const iconMap = {
    home: HomeIcon,
    storage: ArchiveBoxIcon,
    map: MapIcon,
    group: UserGroupIcon,
    journal: DocumentTextIcon,
    notification: BellIcon,
    location: MapPinIcon,
    settings: CogIcon,
    addUser: UserPlusIcon,
};