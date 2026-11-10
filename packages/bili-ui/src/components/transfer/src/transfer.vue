<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import BiliCheckbox from '../../checkbox/src/checkbox.vue'
import { transferProps, type TransferDirection, type TransferItem, type TransferKey } from './transfer'

defineOptions({ name: 'BiliTransfer' })

const props = defineProps(transferProps)

const emit = defineEmits<{
  'update:modelValue': [keys: TransferKey[]]
  change: [keys: TransferKey[], direction: TransferDirection, movedKeys: TransferKey[]]
}>()

const ns = useNamespace('transfer')

const leftQuery = ref('')
const rightQuery = ref('')
const leftSelected = ref<TransferKey[]>([])
const rightSelected = ref<TransferKey[]>([])

const targetSet = computed(() => new Set(props.modelValue))
const sourceItems = computed(() => props.data.filter(item => !targetSet.value.has(item.key)))
const targetItems = computed(() => props.data.filter(item => targetSet.value.has(item.key)))

const filterItems = (items: TransferItem[], query: string): TransferItem[] => {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return items
  return items.filter(item => item.label.toLowerCase().includes(keyword))
}

const leftVisible = computed(() => filterItems(sourceItems.value, leftQuery.value))
const rightVisible = computed(() => filterItems(targetItems.value, rightQuery.value))

const isSelected = (list: TransferKey[], key: TransferKey) => list.includes(key)

const toggleSelection = (
  side: 'left' | 'right',
  item: TransferItem,
  checked?: boolean
) => {
  if (props.disabled || item.disabled) return
  const target = side === 'left' ? leftSelected : rightSelected
  const current = isSelected(target.value, item.key)
  const nextChecked = checked ?? !current
  target.value = nextChecked
    ? [...new Set([...target.value, item.key])]
    : target.value.filter(key => key !== item.key)
}

const selectable = (items: TransferItem[]) => items.filter(item => !item.disabled)

const allChecked = (items: TransferItem[], selected: TransferKey[]) => {
  const options = selectable(items)
  return options.length > 0 && options.every(item => selected.includes(item.key))
}

const partiallyChecked = (items: TransferItem[], selected: TransferKey[]) => {
  const options = selectable(items)
  return !allChecked(items, selected) && options.some(item => selected.includes(item.key))
}

const toggleAll = (side: 'left' | 'right', checked: boolean) => {
  if (props.disabled) return
  const items = side === 'left' ? leftVisible.value : rightVisible.value
  const target = side === 'left' ? leftSelected : rightSelected
  const keys = selectable(items).map(item => item.key)
  const next = new Set(target.value)
  keys.forEach(key => {
    if (checked) next.add(key)
    else next.delete(key)
  })
  target.value = [...next]
}

const move = (direction: TransferDirection) => {
  if (props.disabled) return
  if (direction === 'right') {
    const moved = leftSelected.value.filter(key => {
      const item = props.data.find(entry => entry.key === key)
      return !!item && !item.disabled && !targetSet.value.has(key)
    })
    if (!moved.length) return
    const next = [...props.modelValue, ...moved]
    leftSelected.value = []
    emit('update:modelValue', next)
    emit('change', next, 'right', moved)
    return
  }

  const moved = rightSelected.value.filter(key => targetSet.value.has(key))
  if (!moved.length) return
  const movedSet = new Set(moved)
  const next = props.modelValue.filter(key => !movedSet.has(key))
  rightSelected.value = []
  emit('update:modelValue', next)
  emit('change', next, 'left', moved)
}

const canMoveRight = computed(() => !props.disabled && leftSelected.value.length > 0)
const canMoveLeft = computed(() => !props.disabled && rightSelected.value.length > 0)
</script>

<template>
  <div :class="[ns.b(), ns.is('disabled', disabled)]">
    <section :class="[ns.e('panel'), ns.e('panel-left')]">
      <header :class="ns.e('header')">
        <BiliCheckbox
          v-if="showSelectAll"
          :model-value="allChecked(leftVisible, leftSelected)"
          :indeterminate="partiallyChecked(leftVisible, leftSelected)"
          :disabled="disabled || !selectable(leftVisible).length"
          :aria-label="`全选${titles[0]}`"
          @change="checked => toggleAll('left', checked)"
        />
        <span :class="ns.e('title')">
          <slot name="title" :title="titles[0]" :side="'left'">
            {{ titles[0] }}
          </slot>
        </span>
        <span :class="ns.e('count')">
          {{ leftSelected.length }}/{{ leftVisible.length }}
        </span>
      </header>

      <div v-if="filterable" :class="ns.e('filter')">
        <input
          v-model="leftQuery"
          :class="ns.e('filter-input')"
          type="text"
          :placeholder="filterPlaceholder"
          :disabled="disabled"
        />
      </div>

      <div :class="ns.e('list')">
        <div
          v-for="item in leftVisible"
          :key="item.key"
          :class="[
            ns.e('item'),
            ns.is('checked', isSelected(leftSelected, item.key)),
            ns.is('disabled', item.disabled)
          ]"
          role="option"
          :aria-selected="isSelected(leftSelected, item.key)"
          @click="toggleSelection('left', item)"
        >
          <BiliCheckbox
            :model-value="isSelected(leftSelected, item.key)"
            :disabled="disabled || item.disabled"
            @click.stop
            @change="checked => toggleSelection('left', item, checked)"
          />
          <span :class="ns.e('item-label')">
            <slot name="item" :item="item" :side="'left'">{{ item.label }}</slot>
          </span>
        </div>
        <div v-if="!leftVisible.length" :class="ns.e('empty')">暂无数据</div>
      </div>
    </section>

    <div :class="ns.e('actions')">
      <button
        :class="ns.e('action')"
        type="button"
        aria-label="移到右侧"
        :disabled="!canMoveRight"
        @click="move('right')"
      >
        <BiliIcon name="chevron-right" />
      </button>
      <button
        :class="ns.e('action')"
        type="button"
        aria-label="移到左侧"
        :disabled="!canMoveLeft"
        @click="move('left')"
      >
        <BiliIcon name="chevron-left" />
      </button>
    </div>

    <section :class="[ns.e('panel'), ns.e('panel-right')]">
      <header :class="ns.e('header')">
        <BiliCheckbox
          v-if="showSelectAll"
          :model-value="allChecked(rightVisible, rightSelected)"
          :indeterminate="partiallyChecked(rightVisible, rightSelected)"
          :disabled="disabled || !selectable(rightVisible).length"
          :aria-label="`全选${titles[1]}`"
          @change="checked => toggleAll('right', checked)"
        />
        <span :class="ns.e('title')">
          <slot name="title" :title="titles[1]" :side="'right'">
            {{ titles[1] }}
          </slot>
        </span>
        <span :class="ns.e('count')">
          {{ rightSelected.length }}/{{ rightVisible.length }}
        </span>
      </header>

      <div v-if="filterable" :class="ns.e('filter')">
        <input
          v-model="rightQuery"
          :class="ns.e('filter-input')"
          type="text"
          :placeholder="filterPlaceholder"
          :disabled="disabled"
        />
      </div>

      <div :class="ns.e('list')">
        <div
          v-for="item in rightVisible"
          :key="item.key"
          :class="[
            ns.e('item'),
            ns.is('checked', isSelected(rightSelected, item.key)),
            ns.is('disabled', item.disabled)
          ]"
          role="option"
          :aria-selected="isSelected(rightSelected, item.key)"
          @click="toggleSelection('right', item)"
        >
          <BiliCheckbox
            :model-value="isSelected(rightSelected, item.key)"
            :disabled="disabled || item.disabled"
            @click.stop
            @change="checked => toggleSelection('right', item, checked)"
          />
          <span :class="ns.e('item-label')">
            <slot name="item" :item="item" :side="'right'">{{ item.label }}</slot>
          </span>
        </div>
        <div v-if="!rightVisible.length" :class="ns.e('empty')">暂无数据</div>
      </div>
    </section>
  </div>
</template>
