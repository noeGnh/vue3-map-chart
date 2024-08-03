<script setup lang="ts">
  import { useEventListener, useStyleTag } from '@vueuse/core'
  import type { CSSProperties } from 'vue'

  import type { MapData, MapType } from '../types'
  import { isObject } from '../utils'

  // import Tooltip from './Tooltip.vue'

  // handle props

  interface Props {
    width?: number | string
    height?: number | string
    type?: MapType
    mapStyles?: CSSProperties
    displayLegend?: boolean
    displayLegendWhenEmpty?: boolean
    formatValueWithSIPrefix?: boolean
    legendValuePrefix?: string
    legendValueSuffix?: string
    defaultStrokeColor?: string
    defaultStrokeHoverColor?: string
    defaultFillColor?: string
    defaultFillHoverColor?: string
    baseColor?: string
    data: MapData
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 500,
    width: '100%',
    type: 'world',
    mapStyles: () => ({}),
    displayLegend: true,
    displayLegendWhenEmpty: true,
    formatValueWithSIPrefix: false,
    legendValuePrefix: '',
    legendValueSuffix: '',
    defaultFillColor: 'rgb(236, 236, 236)',
    defaultFillHoverColor: 'rgb(226, 226, 226)',
    defaultStrokeHoverColor: 'rgb(128, 128, 128)',
    defaultStrokeColor: 'rgb(128, 128, 128)',
    baseColor: '#0782c5',
  })

  const height = computed(() =>
    typeof props.height === 'string' ? props.height : `${props.height}px`
  )

  const width = computed(() =>
    typeof props.width === 'string' ? props.width : `${props.width}px`
  )

  const defaultFillColor = computed(() => props.defaultFillColor)

  const defaultFillHoverColor = computed(() =>
    props.displayLegend && props.displayLegendWhenEmpty
      ? props.defaultFillHoverColor
      : props.defaultFillColor
  )

  const defaultStrokeColor = computed(() => props.defaultStrokeColor)

  const defaultCursor = computed(() =>
    props.displayLegend && props.displayLegendWhenEmpty ? 'pointer' : 'default'
  )

  // handle events

  const emits = defineEmits(['mapItemMouseover', 'mapItemClick'])

  onMounted(() => {
    if (isObject(props.data)) {
      Object.keys(props.data).forEach((key) => {
        const el = document.getElementById(`${key.toUpperCase()}`)
        if (el) {
          useEventListener(el, 'mouseover', () => {
            emits('mapItemMouseover', key, props.data[key])
          })
          useEventListener(el, 'click', () => {
            emits('mapItemClick', key, props.data[key])
          })
        }
      })
    }
  })

  // Load svg maps

  const files = import.meta.glob('../assets/maps/**/*.svg', {
    eager: true,
    as: 'raw',
  })

  const svgMaps: { [key: string]: string } = {}

  for (const [key, value] of Object.entries(files)) {
    var svgMapName = key.replace(/^\.\/(.*)\.\w+$/, '$1')

    const parts = svgMapName.split('/')

    const name = parts[parts.length - 1]?.split('.')[0]
    svgMaps[name] = value as string
  }

  // Build map styles

  const { css } = useStyleTag('', {
    id: `v3mc-map-${Date.now()}`,
  })

  const buildStyles = () => {
    if (isObject(props.data)) {
      let min: number | undefined
      let max: number | undefined
      Object.keys(props.data).forEach((key) => {
        const dataValue = props.data[key]

        if (typeof dataValue === 'number') {
          if (min === undefined || dataValue < min) {
            min = dataValue
          }

          if (max === undefined || dataValue > max) {
            max = dataValue
          }
        } else if (isObject(dataValue)) {
          const value = dataValue.value || 0

          if (min === undefined || value < min) {
            min = value
          }

          if (max === undefined || value > max) {
            max = value
          }
        }
      })

      Object.keys(props.data).forEach((key) => {
        const dataValue = props.data[key]

        let value, color, opacity
        if (typeof dataValue === 'number') {
          value = dataValue
        } else if (isObject(dataValue)) {
          value = dataValue.value
          color = dataValue.color
        }

        if (value === undefined || max === undefined || min === undefined) {
          opacity = 1
        } else {
          opacity = (value - min) / (max - min)
        }
        css.value += ` #${key.toUpperCase()} { fill: ${
          color || props.baseColor
        }; fill-opacity: ${opacity}; cursor: ${
          props.displayLegend ? 'pointer' : 'default'
        }; } `
        css.value += ` #${key.toUpperCase()}:hover { fill-opacity: ${
          opacity + 0.05
        }; } `
      })
    }
  }

  watch(
    () => props.data,
    () => {
      buildStyles()
    },
    { deep: true, immediate: true }
  )
</script>

<template>
  <div class="v3mc-container">
    <div class="v3mc-map" :style="mapStyles" v-html="svgMaps[props.type]"></div>
  </div>
</template>

<style scoped>
  .v3mc-container {
    padding: 5px;
  }

  .v3mc-container,
  :deep(.v3mc-map > svg) {
    height: v-bind(height);
    width: v-bind(width);
  }

  :deep(.v3mc-map > svg) {
    stroke: v-bind(defaultStrokeColor);
    fill: v-bind(defaultFillColor);
  }

  :deep(.v3mc-map > svg > path) {
    cursor: v-bind(defaultCursor);
  }

  :deep(.v3mc-map > svg > path:hover) {
    fill: v-bind(defaultFillHoverColor);
    stroke: v-bind(defaultStrokeHoverColor);
  }
</style>
