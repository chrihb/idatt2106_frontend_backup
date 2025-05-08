import { ref } from "vue";
import { HomeIcon, ArchiveBoxIcon, MapIcon, UserGroupIcon, DocumentTextIcon,
    BellIcon, MapPinIcon, UserPlusIcon, CogIcon } from "@heroicons/vue/24/solid/index.js";

export const toggleableSettingKeys = [
    {
      id: 'showStorageStatusOnFrontpage',
      description: 'account-settings.show-storage-on-frontpage',
    },
    {
      id: 'showHouseholdStatusOnFrontpage',
      description: 'account-settings.show-household-on-frontpage',
    }
  ];

export const routedSettings = ref([
    {
        id: 1,
        description: "account-settings.manage-households",
        icon: "home",
        route: "/household/options",
        adminNeeded: false,
        superAdminNeeded: false,
    },
    {
        id: 2,
        description: "account-settings.admin-settings",
        icon: "settings",
        route: "/admin-settings",
        adminNeeded: true,
        superAdminNeeded: false,
    },
    {
        id: 3,
        description: "account-settings.manage-admins",
        icon: "group",
        route: "/manage-admins",
        adminNeeded: false,
        superAdminNeeded: true,
    }
]);


export const iconMap = {
    home: HomeIcon,
    group: UserGroupIcon,
    settings: CogIcon,
};
