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
                route: "/createEmergencyZone",
            },
            {
                id: 2,
                name: "UpdateExistingEmergencyZone",
                desc: "admin-settings.map.updateEmergencyZone",
                route: "/updateEmergencyZone",
            },
            {
                id: 3,
                name: "DeleteEmergencyZone",
                desc: "admin-settings.map.deleteEmergencyZone",
                route: "/deleteEmergencyZone",
            },
            {
                id: 4,
                name: "AddNewMapMarker",
                desc: "admin-settings.map.addNewMapMarker",
                route: "/addMapMarker",
            },
            {
                id: 5,
                name: "AddMarkerType",
                desc: "admin-settings.map.addMarkerType",
                route: "/addMarkerType",
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
                route: "/createNews",
            },
            {
                id: 2,
                name: "DeleteNews",
                desc: "admin-settings.news.deleteNews",
                route: "/deleteNews",
            }
        ]
    },

    ]);