import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        username: '',
    }),
    actions: {
        setCredentials(token, username) {
            this.token = token;
            this.username = username;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
        },
        clearCredentials() {
            this.token = '';
            this.username = '';
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        },
    },
});
