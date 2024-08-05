import { createApp } from 'vue'
import Vue3MapChart from 'vue3-map-chart'

import App from './App.vue'

import(import.meta.env.DEV ? './style.css' : 'vue3-map-chart/dist/style.css')

createApp(App).use(Vue3MapChart).mount('#app')
