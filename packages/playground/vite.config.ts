import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

process.env.NODE_ENV
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/vue3-map-chart' : '/',
  plugins: [
    vue(),
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // global imports to register
      imports: [
        // presets
        'vue',
      ],

      // Auto import for module exports under directories
      // by default it only scan one level of modules under the directory
      dirs: [],

      // Auto import inside Vue template
      // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
      vueTemplate: true,

      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
  ],
  resolve: {
    alias: {
      'vue3-map-chart':
        process.env.NODE_ENV === 'production'
          ? 'vue3-map-chart'
          : 'vue3-map-chart/src/index.ts',
    },
    dedupe: ['vue'],
  },
  build: {
    minify: false,
    rollupOptions: {
      //
    },
  },
  optimizeDeps: {
    exclude: ['vue3-map-chart'],
  },
  server: {
    port: 4320,
  },
})
