import { ref } from "vue";

export const adminSettings = ref([
    {
        id: 1,
        name: "Map",
        desc: "admin-settings.map.name",
        children: [
            {
                id: 1,
                name: "AdministerEmergencyZones",
                desc: "admin-settings.map.adminEmergencyZone",
                route: "/admin-settings/adminEmergencyZone",
            },
            {
                id: 2,
                name: "AdministerEmergencyUtilities",
                desc: "admin-settings.map.adminEmergencyUtilities",
                route: "/admin-settings/adminEmergencyUtilities",
            },
        ]
    },
    {
        id: 2,
        name: "News",
        desc: "admin-settings.news.name",
        children: [
            {
                id: 1,
                name: "CreateNewNews",
                desc: "admin-settings.news.createNewNews",
                route: "/admin-settings/createNews",
            },
            {
                id: 2,
                name: "News",
                desc: "admin-settings.news.news",
                route: "/admin-settings/news",
            }
        ]
    },

    ]);