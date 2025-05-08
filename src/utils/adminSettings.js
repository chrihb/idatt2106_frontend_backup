import { ref } from "vue";

export const adminSettings = ref([
    {
        id: 1,
        name: "Map",
        desc: "admin-settings.map.name",
        children: [
            {
                id: 1,
                name: "CreateNewEmergencyZone",
                desc: "admin-settings.map.createNewEmergencyZone",
                route: "/admin-settings/createEmergencyZone",
            },
            {
                id: 2,
                name: "UpdateExistingEmergencyZone",
                desc: "admin-settings.map.updateEmergencyZone",
                route: "/admin-settings/updateEmergencyZone",
            },
            {
                id: 3,
                name: "DeleteEmergencyZone",
                desc: "admin-settings.map.deleteEmergencyZone",
                route: "/admin-settings/deleteEmergencyZone",
            },
            {
                id: 4,
                name: "AddNewMapMarker",
                desc: "admin-settings.map.addNewMapMarker",
                route: "/admin-settings/addMapMarker",
            },
            {
                id: 5,
                name: "AddMarkerType",
                desc: "admin-settings.map.addMarkerType",
                route: "/admin-settings/addMarkerType",
            }
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
                name: "DeleteNews",
                desc: "admin-settings.news.deleteNews",
                route: "/admin-settings/deleteNews",
            }
        ]
    },

    ]);