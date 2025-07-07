import { createApp } from 'vue'
import Vue3MapChart, { GermanyMap, JapanMap } from 'vue3-map-chart'

import App from './App.vue'

import(import.meta.env.DEV ? './style.css' : 'vue3-map-chart/dist/style.css')

createApp(App)
  .use(Vue3MapChart, { maps: { GermanyMap, JapanMap } })
  .mount('#app')
