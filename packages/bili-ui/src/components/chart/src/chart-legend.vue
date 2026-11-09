<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'

export interface LegendItem {
  name: string
  color: string
  muted?: boolean
}

withDefaults(
  defineProps<{
    items?: LegendItem[]
  }>(),
  { items: () => [] }
)

const ns = useNamespace('chart-legend')
</script>

<template>
  <ul v-if="items.length" :class="ns.b()">
    <li
      v-for="item in items"
      :key="item.name"
      :class="[ns.e('item'), ns.is('muted', item.muted)]"
    >
      <span :class="ns.e('dot')" :style="{ backgroundColor: item.color }" />
      <span :class="ns.e('text')">{{ item.name }}</span>
    </li>
  </ul>
</template>
