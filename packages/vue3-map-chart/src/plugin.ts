import type { Options } from '@/types'
import type { App } from 'vue'

import MapChart from './components/MapChart.vue'

const plugin = {
  install(app: App, options?: Options) {
    app.component(options?.name || 'MapChart', MapChart)

    if (options?.maps) {
      Object.keys(options.maps).forEach((mapName: string) => {
        if (options.maps && options.maps[mapName]) app.component(mapName, options.maps[mapName])
      })
    }
  },
}

export default plugin
