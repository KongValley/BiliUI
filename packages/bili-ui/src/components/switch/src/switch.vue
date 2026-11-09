<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import BiliIcon from '../../icon/src/icon.vue'
import { useFormItem } from '../../form/src/types'
import { switchProps, type SwitchValue } from './switch'

defineOptions({ name: 'BiliSwitch' })

const props = defineProps(switchProps)

const emit = defineEmits<{
  'update:modelValue': [value: SwitchValue]
  change: [value: SwitchValue]
}>()

const ns = useNamespace('switch')
const formItem = useFormItem()

const checked = computed(() => props.modelValue === props.activeValue)
const isDisabled = computed(() => props.disabled || props.loading)

const style = computed<CSSProperties>(() => {
  if (props.width === undefined) return {}
  return { '--bili-switch-width': addUnit(props.width) } as CSSProperties
})

const toggle = () => {
  if (isDisabled.value) return
  const next = checked.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', next)
  emit('change', next)
  formItem?.validate('change')
}
</script>

<template>
  <button
    :class="[
      ns.b(),
      ns.m(size),
      ns.is('checked', checked),
      ns.is('disabled', disabled),
      ns.is('loading', loading)
    ]"
    :style="style"
    type="button"
    role="switch"
    :aria-checked="checked"
    :disabled="isDisabled"
    @click="toggle"
  >
    <span :class="ns.e('core')">
      <span :class="ns.e('action')">
        <BiliIcon v-if="loading" name="loading" spin />
      </span>
    </span>
    <span v-if="activeText || inactiveText" :class="ns.e('label')">
      {{ checked ? activeText : inactiveText }}
    </span>
  </button>
</template>
