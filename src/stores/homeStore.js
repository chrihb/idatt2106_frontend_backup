import { defineStore } from 'pinia';

export const useHomeStore = defineStore('home', {
    state: () => ({
        members: [],
        address: '',
        nearest: {
            shelter: {
                address: '',
                distance: 0,
                location: {
                    lat: 0,
                    lng: 0
                }
            },
            defib: {
                address: '',
                distance: 0,
                location: {
                    lat: 0,
                    lng: 0
                }
            },
            hospital: {
                address: '',
                distance: 0,
                location: {
                    lat: 0,
                    lng: 0
                }
            }
        }
    }),

    actions: {
        setAddress(newAddress) {
            this.address = newAddress;
        },
        addMember(newMember) {
            this.members.push(newMember);
        },
        clearMembers() {
            this.members = [];
        },
    }
});
