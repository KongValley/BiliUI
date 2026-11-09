<script setup lang="ts">
import { provide } from 'vue'
import type { MenuContext } from './context'
import { menuContextKey } from './context'

defineOptions({ name: 'BiliMenuPanelProvider' })

const props = defineProps<{
  parent: MenuContext
}>()

// A floating panel starts a fresh context subtree so descendants always stack
// vertically, regardless of how the parent menu is laid out.
const panelContext: MenuContext = {
  ...props.parent,
  inPanel: true,
  depth: props.parent.depth + 1
}

provide(menuContextKey, panelContext)
</script>

<template>
  <slot />
</template>
