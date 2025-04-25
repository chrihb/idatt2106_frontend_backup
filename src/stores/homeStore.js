import { defineStore } from 'pinia';

export const useHomeStore = defineStore('home', {
    state: () => ({
        members: [],
    }),

    actions: {
        addMember(newMember) {
            this.members.push(newMember);
        },
        clearMembers() {
            this.members = [];
        },
    }
});
