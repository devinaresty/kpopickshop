<script setup lang="ts">
import { useForwardPropsEmits } from 'radix-vue'
import { HoverCardRoot, type HoverCardRootEmits, type HoverCardRootProps } from 'radix-vue'

const props = withDefaults(
  defineProps<HoverCardRootProps>(),
  {
    delayDuration: 700,
  }
)

const emits = defineEmits<HoverCardRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <HoverCardRoot v-bind="forwarded">
    <slot />
  </HoverCardRoot>
</template>
