import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'
import i18n from '@/i18n'
import router from '@/router'
import App from './App.vue'


const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersistedState)

app.use(i18n)
app.use(pinia)
app.use(router)

app.provide('backendURL', 'http://localhost:8088');

app.mount('#app')

