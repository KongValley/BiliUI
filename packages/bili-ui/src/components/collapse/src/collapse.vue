<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { collapseProps } from './collapse'
import { provideCollapseContext } from './context'

defineOptions({ name: 'BiliCollapse' })

const props = defineProps(collapseProps)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | Array<string | number>]
  change: [value: string | number | Array<string | number>]
}>()

const ns = useNamespace('collapse')

const toArray = (value: typeof props.modelValue): Array<string | number> => {
  if (value === undefined || value === null || value === '') return []
  return Array.isArray(value) ? [...value] : [value]
}

const inner = ref<Array<string | number>>(toArray(props.modelValue))

watch(
  () => props.modelValue,
  value => {
    inner.value = toArray(value)
  }
)

const isOpen = (name: string | number): boolean => inner.value.includes(name)

const toggle = (name: string | number) => {
  let next: Array<string | number>

  if (props.accordion) {
    next = isOpen(name) ? [] : [name]
  } else {
    next = isOpen(name) ? inner.value.filter(item => item !== name) : [...inner.value, name]
  }

  inner.value = next
  const payload = props.accordion || next.length === 1 ? next[0] ?? '' : next
  emit('update:modelValue', payload)
  emit('change', payload)
}

provideCollapseContext({
  isOpen,
  toggle,
  accordion: computed(() => props.accordion)
})

const classes = computed(() => [ns.b(), ns.is('bordered', props.bordered)])
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
