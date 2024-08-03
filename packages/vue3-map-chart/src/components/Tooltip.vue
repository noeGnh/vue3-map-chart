<script setup lang="ts">
  interface Props {
    label: string
    value: string
    bgColor?: string
    textColor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    bgColor: 'rgba(0, 0, 0, 0.5)',
    textColor: '#d8d8d8',
  })

  const bgColor = computed(() => props.bgColor)

  const textColor = computed(() => props.textColor)
</script>

<template>
  <div class="v3mc-tooltip-wrapper">
    <span class="v3mc-tooltip-label"> {{ props.label }} </span>
    <div class="v3mc-tooltip-divider"></div>
    <span class="v3mc-tooltip-value"> {{ props.value }} </span>
  </div>
</template>

<style scoped>
  .v3mc-tooltip-wrapper {
    display: inline-block;
    min-width: 150px;
    background-color: v-bind(bgColor);
    color: v-bind(textColor);
    padding: 10px;
    border-radius: 3px;
  }

  .v3mc-tooltip-label {
    font-size: 16px;
    line-height: 20px;
  }

  .v3mc-tooltip-divider {
    flex: 1;
    height: 0.5px;
    background-color: #333;
    margin: 5px 0;
  }

  .v3mc-tooltip-value {
    font-weight: bold;
  }
</style>
