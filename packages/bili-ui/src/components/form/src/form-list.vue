<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { formListProps } from './form-list'
import { useFormItem } from './types'
import FormListItem from './form-list-item.vue'

defineOptions({ name: 'BiliFormList' })

const props = defineProps(formListProps)

const emit = defineEmits<{
  'update:modelValue': [items: any[]]
  add: [index: number]
  remove: [index: number]
}>()

const ns = useNamespace('form-list')
const formItem = useFormItem()

const basePrefix = computed(() => formItem?.prop ?? '')
const itemPrefix = (index: number) =>
  basePrefix.value ? `${basePrefix.value}.${index}` : String(index)

const add = (value?: any, index?: number) => {
  const next = [...props.modelValue]
  let insertAt = index
  let item = value

  // `add(index)` inserts an empty object at that position.
  if (typeof value === 'number') {
    insertAt = value
    item = undefined
  }

  const nextItem = item === undefined ? {} : item
  const position = insertAt ?? next.length
  next.splice(position, 0, nextItem)
  emit('update:modelValue', next)
  emit('add', position)
}

const remove = (index: number) => {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
  emit('remove', index)
}

const move = (from: number, to: number) => {
  if (from === to) return
  const next = [...props.modelValue]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  emit('update:modelValue', next)
}
</script>

<template>
  <div :class="ns.b()">
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      :class="ns.e('item')"
    >
      <FormListItem :prefix="itemPrefix(index)">
        <slot
          :item="item"
          :index="index"
          :field="itemPrefix(index)"
          :add="add"
          :remove="remove"
          :move="move"
        />
      </FormListItem>
    </div>

    <div v-if="$slots.footer" :class="ns.e('footer')">
      <slot name="footer" :add="add" />
    </div>
  </div>
</template>
