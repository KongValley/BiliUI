<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import BiliIcon from '../../icon/src/icon.vue'
import BiliInput from './input.vue'
import { inputSearchProps } from './search'

defineOptions({ name: 'BiliInputSearch' })

const props = defineProps(inputSearchProps)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  search: [value: string]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const ns = useNamespace('input-search')
const locale = useLocale()

const buttonLabel = computed(() => {
  if (typeof props.enterButton === 'string') return props.enterButton
  return props.enterButton ? locale.value.search : ''
})

const search = () => {
  if (props.disabled || props.loading) return
  emit('search', String(props.modelValue ?? ''))
}

const handleInput = (value: string) => {
  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (value: string) => emit('change', value)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') search()
}
</script>

<template>
  <BiliInput
    :class="ns.b()"
    :model-value="modelValue"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    @update:model-value="handleInput"
    @change="handleChange"
    @keydown="handleKeydown"
    @clear="emit('clear')"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <template #append>
      <button
        :class="[ns.e('button'), ns.is('text', !!buttonLabel)]"
        type="button"
        :disabled="disabled || loading"
        :aria-label="buttonLabel || locale.search"
        @click="search"
      >
        <BiliIcon v-if="loading" name="loading" spin />
        <BiliIcon v-else-if="!buttonLabel" name="search" />
        <span v-if="buttonLabel" :class="ns.e('label')">{{ buttonLabel }}</span>
      </button>
    </template>
  </BiliInput>
</template>
