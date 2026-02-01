<script setup lang="ts">
import { HoverCardTrigger } from 'radix-vue'

defineProps<{
  asChild?: boolean
}>()
</script>

<template>
  <HoverCardTrigger :as-child="asChild">
    <slot />
  </HoverCardTrigger>
</template>
