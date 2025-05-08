import { defineStore } from 'pinia';

export const useLayerLabelStore = defineStore('layerLabelStore', {
    state: () => ({
        labels: {
            "home": "Hjem",
            "AndreMedlemmer": "Medlemmer",
            "Hjertestarter": "Hjertestarter",
            "Møteplass": "Møteplass",
            "Matstasjon": "Matstasjon",
            "Bunker": "Tilfluktsrom",
            "Fare nivå 1": "Fare nivå 1",
            "Fare nivå 2": "Fare nivå 2",
            "Fare nivå 3": "Fare nivå 3",

        },
    }),

    getters: {
        getLabel: (state) => (key) => {
            const normalizedKey = key?.trim().replace(/\.png$/i, '');
            return state.labels[normalizedKey] || key;
        }

    },

    actions: {
        updateLabel(key, newLabel) {
            this.labels[key] = newLabel;
        },

        setLabels(newLabels) {
            this.labels = { ...newLabels };
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
            },
        ],
    }
});
