import type { App } from 'vue'

import MapChart from './components/MapChart.vue'

export { MapChart }

const plugin = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  install(app: App, options?: any) {
    app.component('MapChart', MapChart)
  },
}

export default plugin
