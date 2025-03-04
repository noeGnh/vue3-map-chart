<script setup lang="ts">
  import {
    useEventListener,
    useMouse,
    useMouseInElement,
    useStyleTag,
  } from '@vueuse/core'
  import countries from 'i18n-iso-countries'
  import type { CSSProperties } from 'vue'

  import locales from '../i18n-iso-countries-locales'
  import type { MapData, MapDataValue, MapType } from '../types'
  import {
    formatNumberWithSIPrefix,
    getRandomInteger,
    isObject,
    isValidIsoCode,
  } from '../utils'
  import Tooltip from './Tooltip.vue'

  // handle props

  interface Props {
    langCode?: string
    width?: number | string
    height?: number | string
    type?: MapType
    mapStyles?: CSSProperties
    displayLegend?: boolean
    displayLegendWhenEmpty?: boolean
    formatValueWithSiPrefix?: boolean
    forceCursorPointer?: boolean
    legendBgColor?: string
    legendTextColor?: string
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
    langCode: 'en',
    height: 500,
    width: '100%',
    type: 'world',
    mapStyles: () => ({}),
    displayLegend: true,
    displayLegendWhenEmpty: true,
    formatValueWithSiPrefix: false,
    forceCursorPointer: false,
    legendBgColor: undefined,
    legendTextColor: undefined,
    legendValuePrefix: '',
    legendValueSuffix: '',
    defaultFillColor: 'rgb(236, 236, 236)',
    defaultFillHoverColor: 'rgb(226, 226, 226)',
    defaultStrokeHoverColor: 'rgb(200, 200, 200)',
    defaultStrokeColor: 'rgb(200, 200, 200)',
    baseColor: '#0782c5',
  })

  onMounted(() => {
    const registerLocale = async (langCode: string) => {
      try {
        countries.registerLocale(locales[langCode])
      } catch (error) {
        console.error('Error loading locale:', error)
      }
    }

    registerLocale(props.langCode)
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

  const defaultCursor = computed(() => {
    if (props.forceCursorPointer) return 'pointer'

    return props.displayLegend && props.displayLegendWhenEmpty
      ? 'pointer'
      : 'default'
  })

  const cpntId = getRandomInteger(10000, 99999)

  // handle events

  const isOutsideMap = ref(true)
  const currentAreaId = ref<string | null>(null)
  const currentAreaValue = ref<number | MapDataValue | null>(null)

  const emits = defineEmits(['mapItemMouseover', 'mapItemMouseout', 'mapItemClick'])

  onMounted(() => {
    const el = document.getElementById(`v3mc-map-${cpntId}`)
    if (el) {
      useEventListener(el, 'mouseover', (event) => {
        const target = event.target as HTMLElement
        const id = target.getAttribute('id')
        currentAreaId.value = id
        currentAreaValue.value = id ? props.data[id] : null
        if (id && isValidIsoCode(id))
          emits('mapItemMouseover', id, currentAreaValue.value)
      })
      useEventListener(el, 'mouseout', (event) => {
        const target = event.target as HTMLElement
        const id = target.getAttribute('id')
        currentAreaId.value = id
        currentAreaValue.value = id ? props.data[id] : null
        if (id && isValidIsoCode(id))
          emits('mapItemMouseout', id, currentAreaValue.value)
      })
      useEventListener(el, 'click', (event) => {
        const target = event.target as HTMLElement
        const id = target.getAttribute('id')
        currentAreaId.value = id
        currentAreaValue.value = id ? props.data[id] : null
        if (id && isValidIsoCode(id))
          emits('mapItemClick', id, currentAreaValue.value)
      })
      const { isOutside } = useMouseInElement(el)
      watch(
        () => isOutside.value,
        (value) => {
          isOutsideMap.value = value
        }
      )
    }
  })

  const { x, y } = useMouse()

  // load svg maps

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

  // build map styles

  const { css } = useStyleTag('', {
    id: `v3mc-map-${cpntId}-styles`,
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
          opacity = opacity == 0 ? 0.01 : opacity
        }
        css.value += ` #v3mc-map-${cpntId} #${key.toUpperCase()} { fill: ${
          color || props.baseColor
        }; fill-opacity: ${opacity}; cursor: ${
          props.displayLegend ? 'pointer' : 'default'
        }; } `
        css.value += ` #v3mc-map-${cpntId} #${key.toUpperCase()}:hover { fill-opacity: ${
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

  // tooltip

  const tooltipLabel = computed(() => {
    const customLegendLabel =
      typeof currentAreaValue.value === 'number'
        ? undefined
        : currentAreaValue.value?.legendLabel

    const areaName = currentAreaId.value
      ? countries.getName(currentAreaId.value, props.langCode)
      : currentAreaId.value

    return customLegendLabel || areaName || ''
  })

  const tooltipValue = computed(() => {
    let value: number | string =
      (typeof currentAreaValue.value === 'number'
        ? currentAreaValue.value
        : currentAreaValue.value?.value) || ''

    if (typeof value !== 'number') return value

    value = props.formatValueWithSiPrefix
      ? formatNumberWithSIPrefix(value)
      : value

    value = props.legendValuePrefix + value + props.legendValueSuffix

    return value
  })

  const displayTooltip = computed(() => {
    return (
      !isOutsideMap.value &&
      props.displayLegend &&
      (props.displayLegendWhenEmpty || tooltipValue.value) &&
      tooltipLabel.value
    )
  })

  const tooltipX = computed(() => {
    return `${x.value - 100}px`
  })

  const tooltipY = computed(() => {
    return `${y.value - 100}px`
  })
</script>

<template>
  <div class="v3mc-container">
    <div
      :id="`v3mc-map-${cpntId}`"
      class="v3mc-map"
      :style="mapStyles"
      v-html="svgMaps[props.type]"></div>
    <Tooltip
      v-if="displayTooltip"
      :id="`v3mc-tooltip-${cpntId}`"
      class="v3mc-tooltip"
      :label="tooltipLabel"
      :value="tooltipValue"
      :bg-color="props.legendBgColor"
      :text-color="props.legendTextColor"></Tooltip>
  </div>
</template>

<style scoped>
  .v3mc-container {
    padding: 5px;
    position: relative;
  }

  .v3mc-container,
  :deep(.v3mc-map > svg) {
    height: v-bind(height);
    width: v-bind(width);
  }

  :deep(.v3mc-map > svg) {
    stroke: v-bind(defaultStrokeColor);
    fill: v-bind(defaultFillColor);
    stroke-width: 0.4px;
  }

  :deep(.v3mc-map > svg > path) {
    cursor: v-bind(defaultCursor);
  }

  :deep(.v3mc-map > svg > path:hover) {
    fill: v-bind(defaultFillHoverColor);
    stroke: v-bind(defaultStrokeHoverColor);
    stroke-width: 0.5px;
  }

  .v3mc-tooltip {
    position: fixed;
    z-index: 10;
    top: v-bind(tooltipY);
    left: v-bind(tooltipX);
  }
</style>
