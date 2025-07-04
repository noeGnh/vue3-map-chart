# Vue 3 Map Chart ![npm (scoped)](https://img.shields.io/npm/v/vue3-map-chart)

A Vue JS Component for displaying dynamic data on a world, continents and countries maps.

<p align="center">
<img width="600" alt="Demo GIF" src="https://github.com/noeGnh/vue3-map-chart/blob/master/demo.gif"/>
</p>

## Installation

If you are using npm:

```sh
npm i vue3-map-chart
```

If you are using yarn:

```sh
yarn add vue3-map-chart
```

If you are using pnpm:

```sh
pnpm add vue3-map-chart
```

## Demo

View the live demo [`here`](https://noegnh.github.io/vue3-map-chart/)

## Usage

You can add this package globally to your project:

```js
// main.js
import { createApp } from 'vue'

import App from './App.vue'

import Vue3MapChart from 'vue3-map-chart'
import 'vue3-map-chart/dist/style.css'

createApp(App).use(Vue3MapChart).mount('#app')
```

If needed rename component to use:

```js
createApp(App).use(Vue3MapChart, { name: 'MyMapChart' }).mount('#app') // use in template <MyMapChart />
```

Alternatively you can also import the component locally:

```js
<script setup>
 import { MapChart } from 'vue3-map-chart'
 import 'vue3-map-chart/dist/style.css'
</script>
```

This component is most useful for creating heat maps of countries and their subdivisions. It colors each country or subdivision differently based on the props provided.

The component requires a prop of data to be passed to it, which is a JS object formatted like so.

```js
<script setup>
 import { MapChart } from 'vue3-map-chart'

 const data = {
    DE: 95,
    FR: 47,
    GB: 10,
 }
</script>
```

Or if for some reasons you want to customize each country color.

```js
<script setup>
 import { MapChart } from 'vue3-map-chart'

 const data = {
    AU: {
      color: 'blue',
      value: 58,
    },
    NZ: {
      color: '#339601',
      value: 42,
    },
    ID: {
      color: '#F7931E',
      value: 62,
    },
 }
</script>
```

The key must be a valid [ISO 3166-1 country code](https://en.wikipedia.org/wiki/ISO_3166-1) or a [ISO 3166-2 subdivision code](https://en.wikipedia.org/wiki/ISO_3166-2). You can then use the component directly in your template.

```html
<template>
 <MapChart :data="data" />
</template>
```

## Props

| Name                    | Type                                                                                                        | Description                                                                     | Default              | Required |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------- | -------- |
| data                    | number / { value?: number, color?: string, legendLabel?: string }                                           | See Usage Section above for details                                             | undefined            | Yes      |
| name                    | [MapName](https://github.com/noeGnh/vue3-map-chart/blob/master/packages/vue3-map-chart/src/types/map-names.ts) | Name of map displayed                                                           | 'world'              | No       |
| baseColor               | string                                                                                                      | Color use for data representation                                               | '#0782c5'            | No       |
| langCode                | string                                                                                                      | The language of countries name                                                  | 'en'                 | No       |
| width                   | number / string                                                                                             | Width of map                                                                    | '100%'               | No       |
| height                  | number / string                                                                                             | Height of map                                                                   | 500                  | No       |
| mapStyles               | CSSProperties                                                                                               | Styles applied to map                                                           | {}                   | No       |
| displayLegend           | boolean                                                                                                     | Display legend when mouse passes hover area on map                              | true                 | No       |
| displayLegendWhenEmpty  | boolean                                                                                                     | Do not display legend when area value is empty                                  | true                 | No       |
| legendBgColor           | string                                                                                                      | Color of legend tooltip box                                                     | 'rgba(0, 0, 0, 0.5)' | No       |
| legendTextColor         | string                                                                                                      | Color of legend text                                                            | '#d8d8d8'            | No       |
| legendValuePrefix       | string                                                                                                      | Prefix added to value displayed on legend                                       | ''                   | No       |
| legendValueSuffix       | string                                                                                                      | Suffix added to value displayed on legend                                       | ''                   | No       |
| defaultStrokeColor      | string                                                                                                      | Default map stroke color                                                        | 'rgb(200, 200, 200)' | No       |
| defaultStrokeHoverColor | string                                                                                                      | Default map stroke hover color                                                  | 'rgb(200, 200, 200)' | No       |
| defaultFillColor        | string                                                                                                      | Default map fill color                                                          | 'rgb(236, 236, 236)' | No       |
| defaultFillHoverColor   | string                                                                                                      | Default map fill hover color                                                    | 'rgb(226, 226, 226)' | No       |
| formatValueWithSiPrefix | boolean                                                                                                     | Formats a number with a magnitude suffix                                        | false                | No       |
| forceCursorPointer      | boolean                                                                                                     | Force the cursor to be in pointer mode even when the legend display is disabled | false                | No       |

## Events

- mapItemClick
  - This event is fired when an map area is clicked.

- mapItemMouseout
  - This event is fired when the mouse leaves a map area.

- mapItemMouseover
  - This event is fired when the mouse passes over the top of an map area.

```js
<script setup>
 import { MapChart } from 'vue3-map-chart'

 const data = {
    US: 43,
    CA: 63,
    GB: 20,
 }

  const onMapItemClick = (areaId, areaValue) => {
    //
  }

  const onMapItemMouseout = (areaId, areaValue) => {
    //
  }

  const onMapItemMouseover = (areaId, areaValue) => {
    //
  }
</script>
```

```html
<template>
 <MapChart
    :data="data"
    @map-item-click="onMapItemClick"
    @map-item-mouseover="onMapItemMouseover"/>
</template>
```

## Credits

This package use SVG maps from [`amCharts`](https://www.amcharts.com/svg-maps)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/noeGnh/vue3-map-chart/releases).

## License

[MIT](https://github.com/noeGnh/vue3-map-chart/blob/master/LICENSE)
