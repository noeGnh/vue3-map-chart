<script setup lang="ts">
  interface Props {
    label: string
    value: string
    bgColor?: string
    textColor?: string
    dividerColor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    bgColor: 'rgba(0, 0, 0, 0.5)',
    textColor: '#fff',
    dividerColor: 'rgba(255, 255, 255, 0.5)',
  })

  const bgColor = computed(() => props.bgColor)

  const textColor = computed(() => props.textColor)

  const dividerColor = computed(() => props.dividerColor)
</script>

<template>
  <div class="v3mc-tooltip-wrapper">
    <span class="v3mc-tooltip-label"> {{ props.label }} </span>
    <template v-if="props.value">
      <div class="v3mc-tooltip-divider"></div>
      <span class="v3mc-tooltip-value"> {{ props.value }} </span>
    </template>
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
    font-size: 1rem;
    line-height: 20px;
  }

  .v3mc-tooltip-divider {
    flex: 1;
    height: 0.5px;
    background-color: v-bind(dividerColor);
    margin: 5px 0;
  }

  .v3mc-tooltip-value {
    font-weight: bold;
  }
</style>
