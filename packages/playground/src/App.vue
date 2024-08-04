<script setup lang="ts">
  import type { MapDataValue } from 'vue3-map-chart/types/types'

  const worldData = {
    US: 13,
    CA: 63,
    GB: 10,
    DE: 95,
    JP: 76,
    CN: 46,
    IN: 98,
    BR: 96,
    AU: 10,
    IT: 85,
    RU: 42,
    ZA: 58,
    NG: 72,
    MX: 13,
    ES: 17,
    AR: 64,
    CH: 41,
    NL: 35,
    KR: 45,
    SE: 72,
    NO: 79,
    FI: 34,
    DK: 81,
    PL: 27,
    GR: 78,
    PT: 77,
    BE: 14,
    IE: 92,
    NZ: 83,
    IL: 43,
    TR: 42,
    SA: 74,
    EG: 93,
    PK: 54,
    BD: 25,
    IR: 29,
    IQ: 60,
    AF: 22,
    DZ: 17,
    MA: 60,
    TH: 96,
    MY: 64,
    VN: 11,
    PH: 51,
    SG: 20,
    ID: 47,
    CL: 53,
    CO: 30,
    PE: 47,
    VE: 57,
    CU: 92,
    FR: 47,
  }

  const africaData = {
    ZA: 58, // South Africa
    NG: 72, // Nigeria
    EG: 93, // Egypt
    KE: 45, // Kenya
    GH: 39, // Ghana
    DZ: 17, // Algeria
    MA: 60, // Morocco
    TZ: 25, // Tanzania
    UG: 48, // Uganda
    AO: 34, // Angola
    ET: 50, // Ethiopia
    SN: 30, // Senegal
    CI: 21, // Ivory Coast
    TN: 40, // Tunisia
    BF: 29, // Burkina Faso
    MZ: 26, // Mozambique
    ZM: 33, // Zambia
    CM: 37, // Cameroon
    MG: 20, // Madagascar
    ML: 22, // Mali
    RW: 28, // Rwanda
    NE: 18, // Niger
    SL: 19, // Sierra Leone
    NA: 24, // Namibia
    BW: 32, // Botswana
  }

  const asiaData = {
    CN: 46, // China
    IN: 98, // India
    JP: 76, // Japan
    KR: 45, // South Korea
    ID: 47, // Indonesia
    PK: 54, // Pakistan
    BD: 25, // Bangladesh
    VN: 11, // Vietnam
    PH: 51, // Philippines
    TH: 96, // Thailand
    MY: 64, // Malaysia
    SG: 20, // Singapore
    MM: 31, // Myanmar
    LK: 22, // Sri Lanka
    KH: 28, // Cambodia
    LA: 19, // Laos
    NP: 37, // Nepal
    MN: 15, // Mongolia
    KZ: 33, // Kazakhstan
    UZ: 29, // Uzbekistan
    SA: 74, // Saudi Arabia
    IR: 29, // Iran
    IQ: 60, // Iraq
    SY: 23, // Syria
    JO: 27, // Jordan
    LB: 18, // Lebanon
    YE: 24, // Yemen
    OM: 35, // Oman
    QA: 42, // Qatar
    KW: 39, // Kuwait
    AE: 49, // United Arab Emirates
    IL: 43, // Israel
    AF: 22, // Afghanistan
  }

  const europeData = {
    DE: 95, // Germany
    FR: 47, // France
    GB: 10, // United Kingdom
    IT: 85, // Italy
    ES: 17, // Spain
    PL: 27, // Poland
    RO: 30, // Romania
    NL: 35, // Netherlands
    BE: 14, // Belgium
    GR: 78, // Greece
    PT: 77, // Portugal
    CZ: 29, // Czech Republic
    HU: 31, // Hungary
    SE: 72, // Sweden
    AT: 44, // Austria
    CH: 41, // Switzerland
    BG: 22, // Bulgaria
    DK: 81, // Denmark
    FI: 34, // Finland
    NO: 79, // Norway
    IE: 92, // Ireland
    HR: 28, // Croatia
    SI: 26, // Slovenia
    SK: 33, // Slovakia
    LT: 18, // Lithuania
    LV: 20, // Latvia
    EE: 21, // Estonia
    CY: 25, // Cyprus
    LU: 19, // Luxembourg
    MT: 23, // Malta
    IS: 30, // Iceland
    UA: 50, // Ukraine
    BY: 32, // Belarus
    RU: 42, // Russia
  }

  const northAmericaData = {
    US: 13500, // United States
    CA: 63800, // Canada
    MX: 13450, // Mexico
    GT: 27520, // Guatemala
    HN: 18260, // Honduras
    SV: 19657, // El Salvador
    NI: 23905, // Nicaragua
    CR: 24000, // Costa Rica
    PA: 33600, // Panama
    HT: 22469, // Haiti
    DO: 285, // Dominican Republic
    CU: 36223, // Cuba
    JM: 31111, // Jamaica
    BS: 15333, // Bahamas
    BB: 2009, // Barbados
    TT: 25456, // Trinidad and Tobago
    BZ: 17000, // Belize
    AG: 21223, // Antigua and Barbuda
    DM: 16505, // Dominica
    LC: 29098, // Saint Lucia
    VC: 1434, // Saint Vincent and the Grenadines
    GD: 26009, // Grenada
    KN: 12000, // Saint Kitts and Nevis
  }

  const southAmericaData = {
    AR: 4500, // Argentina
    BO: 3400, // Bolivia
    BR: 7800, // Brazil
    CL: 5200, // Chile
    CO: 6700, // Colombia
    EC: 3900, // Ecuador
    GY: 2200, // Guyana
    PY: 2900, // Paraguay
    PE: 7100, // Peru
    SR: 1800, // Suriname
    UY: 3300, // Uruguay
    VE: 5500, // Venezuela
  }

  const oceaniaData = {
    AU: {
      color: 'blue',
      legendLabel: 'Australia / Capital: Canberra',
    }, // Australia
    NZ: {
      color: '#339601',
      legendLabel: 'New Zealand / Capital: Wellington',
    }, // New Zealand
    ID: {
      color: '#F7931E',
      legendLabel: 'Indonesia / Capital: Jakarta',
    }, // Indonesia
    PG: {
      color: '#D31F3C',
      legendLabel: 'Papua New Guinea / Capital: Port Moresby',
    }, // Papua New Guinea
    SB: {
      color: '#FFC700',
      legendLabel: 'Solomon Islands / Capital: Honiara',
    }, // Solomon Islands
    VU: {
      color: '#132D50',
      legendLabel: 'Vanuatu / Capital: Port Vila',
    }, // Vanuatu
    PH: {
      legendLabel: 'Philippines / Capital: Manila',
    }, // Philippines
  }

  const onMapItemClick = (areaId: string, areaValue: number | MapDataValue) => {
    alert(`${areaId}: ${areaValue}`)
  }
</script>

<template>
  <div class="grid-container">
    <div class="cell big">
      <MapChart
        :data="worldData"
        :map-styles="{ height: '100%' }"
        :display-legend-when-empty="false"
        @map-item-click="onMapItemClick" />
    </div>
    <div class="cell small">
      <MapChart
        type="africa"
        base-color="#339601"
        legend-value-suffix="&nbsp;%"
        legend-text-color="whitesmoke"
        legend-bg-color="rgba(0, 0, 255, 0.8)"
        :data="africaData"
        :map-styles="{ height: '100%' }"
        :display-legend-when-empty="false"
        @map-item-click="onMapItemClick" />
    </div>
    <div class="cell small">
      <MapChart
        type="asia"
        lang-code="zh"
        base-color="#F7931E"
        :data="asiaData"
        :map-styles="{ height: '100%' }"
        :display-legend-when-empty="false"
        @map-item-click="onMapItemClick" />
    </div>
    <div class="cell small">
      <MapChart
        type="europe"
        lang-code="fr"
        base-color="#D31F3C"
        legend-value-suffix="&nbsp;€"
        :data="europeData"
        :map-styles="{ height: '100%' }"
        :display-legend-when-empty="false"
        @map-item-click="onMapItemClick" />
    </div>
    <div class="cell small">
      <MapChart
        type="north-america"
        base-color="#FFC700"
        legend-value-prefix="$&nbsp;"
        :data="northAmericaData"
        :map-styles="{ height: '100%' }"
        @map-item-click="onMapItemClick" />
    </div>
    <div class="cell small">
      <MapChart
        type="south-america"
        base-color="#132D50"
        legend-text-color="black"
        legend-bg-color="rgba(255, 255, 255, 0.8)"
        legend-value-suffix="&nbsp;km2"
        format-value-with-si-prefix
        :data="southAmericaData"
        :map-styles="{ height: '100%' }"
        @map-item-click="onMapItemClick" />
    </div>
    <div class="cell small">
      <MapChart
        type="oceania"
        :data="oceaniaData"
        :map-styles="{ height: '100%' }"
        @map-item-click="onMapItemClick" />
    </div>
  </div>
</template>

<style>
  body,
  html {
    margin: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
</style>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 5px;
    width: 100%;
    height: 100%;
  }

  .cell {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    font-size: 20px;
    font-weight: bold;
  }

  .big {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
    border: 1px solid #ccc;
  }

  .small:nth-child(2) {
    grid-column: 3;
    grid-row: 1;
  }
  .small:nth-child(3) {
    grid-column: 4;
    grid-row: 1;
  }
  .small:nth-child(4) {
    grid-column: 3;
    grid-row: 2;
  }
  .small:nth-child(5) {
    grid-column: 4;
    grid-row: 2;
  }
  .small:nth-child(6) {
    grid-column: 1;
    grid-row: 2;
  }
  .small:nth-child(7) {
    grid-column: 2;
    grid-row: 2;
  }

  @media (max-width: 800px) {
    .grid-container {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(4, auto);
      gap: 10px;
    }

    .big {
      grid-column: 1 / 3;
      grid-row: 1 / 2;
    }

    .small:nth-child(2) {
      grid-column: 1;
      grid-row: 2;
    }
    .small:nth-child(3) {
      grid-column: 2;
      grid-row: 2;
    }
    .small:nth-child(4) {
      grid-column: 1;
      grid-row: 3;
    }
    .small:nth-child(5) {
      grid-column: 2;
      grid-row: 3;
    }
    .small:nth-child(6) {
      grid-column: 1;
      grid-row: 4;
    }
    .small:nth-child(7) {
      grid-column: 2;
      grid-row: 4;
    }
  }
</style>
