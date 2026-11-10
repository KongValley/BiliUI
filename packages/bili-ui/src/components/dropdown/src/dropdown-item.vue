<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import { dropdownItemProps } from './dropdown'
import { useDropdownContext } from './context'

defineOptions({ name: 'BiliDropdownItem' })

const props = defineProps(dropdownItemProps)

const ns = useNamespace('dropdown-item')
const dropdown = useDropdownContext()

const handleClick = () => {
  if (props.disabled) return
  dropdown?.select(props.itemKey)
}
</script>

<template>
  <button
    :class="[
      ns.b(),
      ns.is('disabled', disabled),
      ns.is('divided', divided)
    ]"
    type="button"
    role="menuitem"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot name="icon">
      <span v-if="$slots.icon || $slots.default" :class="ns.e('spacer')" />
    </slot>
    <span :class="ns.e('label')"><slot /></span>
    <span v-if="shortcut" :class="ns.e('shortcut')">{{ shortcut }}</span>
  </button>
</template>
