import type { App } from 'vue'

import HelloWorld from './components/HelloWorld.vue'

export { HelloWorld }

const plugin = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  install(app: App, options?: any) {
    app.component('HelloWorld', HelloWorld)
  },
}

export default plugin
