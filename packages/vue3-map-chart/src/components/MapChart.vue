<script setup lang="ts">
  import type { MapData, MapDataValue } from '@/types'
  import {
    useElementBounding,
    useEventListener,
    useMouse,
    useMouseInElement,
    useStyleTag,
  } from '@vueuse/core'
  import countries from 'i18n-iso-countries'
  import iso3166 from 'iso-3166-2'
  import type { CSSProperties } from 'vue'

  import locales from '../i18n-iso-countries-locales'
  import {
    formatNumberWithSIPrefix,
    getRandomInteger,
    isObject,
    isSVG,
    isValidIsoCode,
  } from '../utils'
  import Tooltip from './Tooltip.vue'

  // handle props

  interface Props {
    langCode?: string
    width?: number | string
    height?: number | string
    mapStyles?: CSSProperties
    displayLegend?: boolean
    displayLegendWhenEmpty?: boolean
    formatValueWithSiPrefix?: boolean
    forceCursorPointer?: boolean
    legendBgColor?: string
    legendTextColor?: string
    legendDividerColor?: string
    legendValuePrefix?: string
    legendValueSuffix?: string
    defaultStrokeColor?: string
    defaultStrokeHoverColor?: string
    defaultFillColor?: string
    defaultFillHoverColor?: string
    baseColor?: string
    customMapSvg?: string
    customMapLabels?: Record<string, string>
    data: MapData
  }

  const props = withDefaults(defineProps<Props>(), {
    langCode: 'en',
    height: 500,
    width: '100%',
    mapStyles: () => ({}),
    displayLegend: true,
    displayLegendWhenEmpty: true,
    formatValueWithSiPrefix: false,
    forceCursorPointer: false,
    legendBgColor: undefined,
    legendTextColor: undefined,
    legendDividerColor: undefined,
    legendValuePrefix: '',
    legendValueSuffix: '',
    defaultFillColor: 'rgb(236, 236, 236)',
    defaultFillHoverColor: 'rgb(226, 226, 226)',
    defaultStrokeHoverColor: 'rgb(200, 200, 200)',
    defaultStrokeColor: 'rgb(200, 200, 200)',
    baseColor: '#0782c5',
    customMapSvg: '',
    customMapLabels: () => ({}),
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

  const mapHeight = computed(() =>
    typeof props.height === 'string' ? props.height : `${props.height}px`
  )

  const mapWidth = computed(() =>
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

  const emits = defineEmits([
    'mapItemTouchstart',
    'mapItemMouseover',
    'mapItemMouseout',
    'mapItemClick',
  ])

  onMounted(() => {
    const el = document.getElementById(`v3mc-map-${cpntId}`)
    if (el) {
      const emitEvent = (
        target: HTMLElement,
        emitId:
          | 'mapItemMouseover'
          | 'mapItemMouseout'
          | 'mapItemClick'
          | 'mapItemTouchstart'
      ) => {
        const id = target.getAttribute('id')
        currentAreaId.value = id
        currentAreaValue.value = id ? props.data[id] : null
        if (
          id &&
          isValidIsoCode(id) &&
          !!(
            countries.getName(id, props.langCode) ||
            iso3166.subdivision(id)?.name
          )
        ) {
          emits(emitId, id, currentAreaValue.value)
          if (emitId == 'mapItemTouchstart') {
            isOutsideMap.value = false
          }
        } else {
          if (emitId == 'mapItemTouchstart') {
            isOutsideMap.value = true
          }
        }
      }
      useEventListener(el, 'touchstart', (event) => {
        emitEvent(event.target as HTMLElement, 'mapItemTouchstart')
      })
      useEventListener(el, 'mouseover', (event) => {
        emitEvent(event.target as HTMLElement, 'mapItemMouseover')
      })
      useEventListener(el, 'mouseout', (event) => {
        emitEvent(event.target as HTMLElement, 'mapItemMouseout')
      })
      useEventListener(el, 'click', (event) => {
        emitEvent(event.target as HTMLElement, 'mapItemClick')
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

  // load svg map
  const slots = useSlots()
  const svgMap = ref<string | null>(null)

  const loadSvgMap = async (): Promise<void> => {
    if (props.customMapSvg && isSVG(props.customMapSvg)) {
      svgMap.value = props.customMapSvg
      return
    }

    if (slots.default) {
      const slotContent = slots.default()

      svgMap.value = slotContent[0].type as string
    } else {
      console.warn('No map found')
      svgMap.value = ''
    }
  }

  watch(
    () => slots.default,
    () => {
      loadSvgMap()
    },
    { immediate: true, deep: true }
  )

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
          opacity = opacity == 0 ? 0.05 : opacity
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

    const customMapLabel =
      props.customMapLabels &&
      currentAreaId.value &&
      props.customMapLabels[currentAreaId.value]
        ? props.customMapLabels[currentAreaId.value]
        : undefined

    const areaName = currentAreaId.value
      ? countries.getName(currentAreaId.value, props.langCode) ||
        iso3166.subdivision(currentAreaId.value)?.name ||
        currentAreaId.value
      : currentAreaId.value

    return customLegendLabel || customMapLabel || areaName || ''
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

  const tooltip = ref()
  const { x: mouseX, y: mouseY } = useMouse()
  const { width: tooltipWidth, height: tooltipHeight } = useElementBounding(
    tooltip as any
  )

  const tooltipLeft = computed(() => {
    let left = mouseX.value + 12

    if (left + tooltipWidth.value > window.innerWidth) {
      left = mouseX.value - tooltipWidth.value - 12
    }

    return `${left}px`
  })

  const tooltipTop = computed(() => {
    let top = mouseY.value + 12

    if (top + tooltipHeight.value > window.innerHeight) {
      top = mouseY.value - tooltipHeight.value - 12
    }

    return `${top}px`
  })
</script>

<template>
  <div class="v3mc-container">
    <div
      :id="`v3mc-map-${cpntId}`"
      class="v3mc-map"
      :style="mapStyles"
      v-html="svgMap"></div>
    <Tooltip
      v-if="displayTooltip"
      :id="`v3mc-tooltip-${cpntId}`"
      ref="tooltip"
      class="v3mc-tooltip"
      :label="tooltipLabel"
      :value="tooltipValue"
      :bg-color="props.legendBgColor"
      :text-color="props.legendTextColor"
      :divider-color="props.legendDividerColor" />
  </div>
</template>

<style scoped>
  .v3mc-container {
    padding: 5px;
    position: relative;
  }

  .v3mc-container,
  :deep(.v3mc-map > svg) {
    height: v-bind(mapHeight);
    width: v-bind(mapWidth);
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
    top: v-bind(tooltipTop);
    left: v-bind(tooltipLeft);
  }
</style>
