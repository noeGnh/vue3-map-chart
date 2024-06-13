<script lang="ts" setup>
  interface Props {
    path: string
  }

  const props = withDefaults(defineProps<Props>(), {})

  const icon = defineAsyncComponent(
    () => import(/* @vite-ignore */ `${props.path}?component`)
  )
</script>

<template>
  <component :is="icon" />
</template>
