<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useId } from '../../../hooks/use-id'
import { useZIndex } from '../../../hooks/use-z-index'
import {
  findNodePath,
  nodeLabel,
  resolveTreeFields,
  type TreeKey,
  type TreeOption
} from '../../../utils/tree'
import BiliIcon from '../../icon/src/icon.vue'
import BiliTree from '../../tree/src/tree.vue'
import { treeSelectProps, type TreeSelectValue } from './tree-select'

defineOptions({ name: 'BiliTreeSelect' })

const props = defineProps(treeSelectProps)

const emit = defineEmits<{
  'update:modelValue': [value: TreeSelectValue]
  change: [value: TreeSelectValue, nodes: TreeOption[]]
  'visible-change': [visible: boolean]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const ns = useNamespace('tree-select')
const { nextZIndex, currentZIndex } = useZIndex()
const panelId = useId('bili-tree-select-panel')

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const triggerWidth = ref(0)

const fields = computed(() => resolveTreeFields(props.fieldNames))

const { floatingStyles, isPositioned } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-start',
  offset: 6
})

const selectedKeys = computed<TreeKey[]>(() => {
  const value = props.modelValue
  if (props.multiple) {
    return Array.isArray(value) ? (value as TreeKey[]) : []
  }
  return value === null || value === undefined ? [] : [value as TreeKey]
})

const findNode = (key: TreeKey): TreeOption | undefined => {
  const path = findNodePath(props.data, value => value === key, fields.value)
  return path?.[path.length - 1]
}

const selectedNodes = computed<TreeOption[]>(() =>
  selectedKeys.value.map(key => findNode(key)).filter((node): node is TreeOption => !!node)
)

const selectedLabel = computed(() =>
  selectedNodes.value.map(node => nodeLabel(node, fields.value)).join(', ')
)

const nodeKey = (node: TreeOption): TreeKey => node[fields.value.value] as TreeKey

const visibleTags = computed(() =>
  props.maxTagCount === undefined
    ? selectedNodes.value
    : selectedNodes.value.slice(0, Math.max(0, props.maxTagCount))
)

const restTagCount = computed(() => selectedNodes.value.length - visibleTags.value.length)

const hasValue = computed(() => selectedKeys.value.length > 0)
const showClear = computed(() => props.clearable && hasValue.value && !props.disabled)

const panelStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  minWidth: `${triggerWidth.value}px`,
  zIndex: currentZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  nextZIndex()
  triggerWidth.value = triggerRef.value?.getBoundingClientRect().width ?? 0
  emit('visible-change', true)
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  emit('visible-change', false)
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const commit = (value: TreeSelectValue, nodes: TreeOption[]) => {
  emit('update:modelValue', value)
  emit('change', value, nodes)
}

const handleSelect = (key: TreeKey) => {
  const node = findNode(key)
  if (!node) return
  commit(key, [node])
  close()
  triggerRef.value?.focus()
}

const handleCheck = (keys: TreeKey[]) => {
  const nodes = keys.map(key => findNode(key)).filter((node): node is TreeOption => !!node)
  commit([...keys], nodes)
}

const removeTag = (key: TreeKey) => {
  if (props.disabled) return
  commit(
    selectedKeys.value.filter(item => item !== key),
    selectedNodes.value.filter(node => {
      const value = node[fields.value.value]
      return value !== key
    })
  )
}

const clear = () => {
  commit(props.multiple ? [] : null, [])
  emit('clear')
  if (!props.multiple) close()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  if (event.key === 'ArrowDown' && !isOpen.value) {
    event.preventDefault()
    open()
  } else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    close()
  } else if (event.key === 'Tab') {
    close()
  }
}

const focus = () => triggerRef.value?.focus()
const blur = () => triggerRef.value?.blur()

watch(
  () => props.disabled,
  disabled => {
    if (disabled) close()
  }
)

useClickOutside([triggerRef, panelRef], () => close())

defineExpose({ focus, blur, open, close })
</script>

<template>
  <div
    ref="triggerRef"
    :class="[
      ns.b(),
      ns.m(size),
      ns.is('multiple', multiple),
      ns.is('open', isOpen),
      ns.is('disabled', disabled)
    ]"
    role="combobox"
    aria-haspopup="tree"
    :aria-expanded="isOpen"
    :aria-controls="panelId"
    :tabindex="disabled ? -1 : 0"
    @click="toggle"
    @keydown="handleKeydown"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <div :class="ns.e('content')">
      <template v-if="multiple">
        <div :class="ns.e('tags')">
          <span v-for="node in visibleTags" :key="String(nodeKey(node))" :class="ns.e('tag')">
            <span :class="ns.e('tag-label')">
              {{ nodeLabel(node, fields) }}
            </span>
            <button
              :class="ns.e('tag-close')"
              type="button"
              tabindex="-1"
              :aria-label="`移除 ${nodeLabel(node, fields)}`"
              @mousedown.stop.prevent
              @click.stop="removeTag(nodeKey(node))"
            >
              <BiliIcon name="close" />
            </button>
          </span>
          <span v-if="restTagCount > 0" :class="[ns.e('tag'), ns.is('rest', true)]">
            +{{ restTagCount }}
          </span>
          <span v-if="!selectedNodes.length" :class="[ns.e('value'), ns.is('placeholder', true)]">
            {{ placeholder }}
          </span>
        </div>
      </template>

      <span
        v-else
        :class="[ns.e('value'), ns.is('placeholder', !hasValue)]"
        :title="hasValue ? selectedLabel : undefined"
      >
        {{ hasValue ? selectedLabel : placeholder }}
      </span>
    </div>

    <span :class="ns.e('suffix')">
      <button
        v-if="showClear"
        :class="ns.e('clear')"
        type="button"
        tabindex="-1"
        aria-label="清空"
        @click.stop="clear"
      >
        <BiliIcon name="close-circle" />
      </button>
      <BiliIcon :class="ns.e('arrow')" name="chevron-down" />
    </span>
  </div>

  <Teleport to="body">
    <Transition name="bili-tree-select-dropdown">
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        :class="[ns.e('panel'), popperClass]"
        :style="panelStyles"
      >
        <BiliTree
          :data="data"
          :field-names="fieldNames"
          :model-value="multiple ? undefined : selectedKeys[0]"
          :selectable="!multiple"
          :checkable="multiple"
          :checked-keys="multiple ? selectedKeys : undefined"
          :check-strictly="checkStrictly"
          :default-expand-all="defaultExpandAll"
          :filterable="filterable"
          :filter-placeholder="filterPlaceholder"
          :empty-text="emptyText"
          @update:model-value="handleSelect"
          @update:checked-keys="handleCheck"
        />
      </div>
    </Transition>
  </Teleport>
</template>
