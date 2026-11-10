<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { menuItemProps } from './menu'
import { useMenuContext } from './context'

defineOptions({ name: 'BiliMenuItem' })

const props = defineProps(menuItemProps)

const emit = defineEmits<{
  click: [item: { key: string; label: string }, event: MouseEvent]
}>()

const ns = useNamespace('menu-item')
const menu = useMenuContext()

const isActive = () => menu.selectedKey.value === props.itemKey

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  menu.select(props.itemKey, props.label)
  emit('click', { key: props.itemKey, label: props.label }, event)
}
</script>

<template>
  <li :class="ns.b()" role="none">
    <button
      :class="[
        ns.e('inner'),
        ns.is('active', isActive()),
        ns.is('disabled', disabled),
        ns.is('collapsed', menu.collapsed.value && !menu.inPanel)
      ]"
      type="button"
      role="menuitem"
      :aria-current="isActive() ? 'page' : undefined"
      :disabled="disabled"
      :title="menu.collapsed.value && !menu.inPanel ? label : undefined"
      @click="handleClick"
    >
      <BiliIcon v-if="icon" :class="ns.e('icon')" :name="icon" />
      <span v-if="$slots.default || !menu.collapsed.value || menu.inPanel" :class="ns.e('label')">
        <slot>{{ label }}</slot>
      </span>
    </button>
  </li>
</template>
