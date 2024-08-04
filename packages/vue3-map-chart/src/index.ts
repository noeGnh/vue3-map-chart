import type { App } from 'vue'

import MapChart from './components/MapChart.vue'
import type { Options } from './types'

export { MapChart }

const plugin = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  install(app: App, options?: Options) {
    app.component(options?.name || 'MapChart', MapChart)
  },
}

export default plugin
