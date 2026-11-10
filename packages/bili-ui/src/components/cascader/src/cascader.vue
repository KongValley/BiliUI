<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useId } from '../../../hooks/use-id'
import { useZIndex } from '../../../hooks/use-z-index'
import {
  findNodePath,
  isNodeDisabled,
  nodeChildren,
  nodeLabel,
  nodeValue,
  resolveTreeFields,
  type TreeOption
} from '../../../utils/tree'
import BiliIcon from '../../icon/src/icon.vue'
import { cascaderProps, type CascaderValue } from './cascader'

defineOptions({ name: 'BiliCascader' })

const props = defineProps(cascaderProps)

const emit = defineEmits<{
  'update:modelValue': [value: CascaderValue]
  change: [value: CascaderValue, path: TreeOption[]]
  'visible-change': [visible: boolean]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const ns = useNamespace('cascader')
const { nextZIndex, currentZIndex } = useZIndex()
const panelId = useId('bili-cascader-panel')

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const activePath = ref<TreeOption[]>([])
const triggerWidth = ref(0)

const fields = computed(() => resolveTreeFields(props.fieldNames))

const { floatingStyles, isPositioned } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-start',
  offset: 6
})

const selectedPath = computed<TreeOption[]>(() => {
  if (props.modelValue === null || props.modelValue === undefined) return []
  return (
    findNodePath(
      props.options,
      value => value === props.modelValue,
      fields.value
    ) ?? []
  )
})

const displayLabel = computed(() =>
  selectedPath.value.map(node => nodeLabel(node, fields.value)).join(props.separator)
)

const hasValue = computed(() => selectedPath.value.length > 0)
const showClear = computed(() => props.clearable && hasValue.value && !props.disabled)

/** One column for the root level plus one for every expanded branch. */
const columns = computed<TreeOption[][]>(() => {
  const result: TreeOption[][] = [props.options]
  for (const node of activePath.value) {
    const children = nodeChildren(node, fields.value)
    if (!children?.length) break
    result.push(children)
  }
  return result
})

const panelStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  minWidth: `${triggerWidth.value}px`,
  zIndex: currentZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  activePath.value = [...selectedPath.value]
  nextZIndex()
  triggerWidth.value = triggerRef.value?.getBoundingClientRect().width ?? 0
  emit('visible-change', true)
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  activePath.value = []
  emit('visible-change', false)
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const commit = (value: CascaderValue, path: TreeOption[]) => {
  emit('update:modelValue', value)
  emit('change', value, path)
}

const handleNodeClick = (node: TreeOption, level: number) => {
  if (isNodeDisabled(node, fields.value)) return

  const path = [...activePath.value.slice(0, level), node]
  const value = nodeValue(node, fields.value)
  if (value === undefined) return

  activePath.value = path
  const children = nodeChildren(node, fields.value)

  if (children?.length) {
    if (props.changeOnSelect) commit(value, path)
    return
  }

  commit(value, path)
  close()
  triggerRef.value?.focus()
}

const clear = () => {
  commit(null, [])
  emit('clear')
  close()
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

const isActive = (node: TreeOption, level: number): boolean => {
  const active = activePath.value[level]
  return !!active && nodeValue(active, fields.value) === nodeValue(node, fields.value)
}

const isSelected = (node: TreeOption): boolean =>
  nodeValue(node, fields.value) === props.modelValue

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
    <span
      :class="[ns.e('value'), ns.is('placeholder', !hasValue)]"
      :title="hasValue ? displayLabel : undefined"
    >
      {{ hasValue ? displayLabel : placeholder }}
    </span>

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
    <Transition name="bili-cascader-dropdown">
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        :class="ns.e('panel')"
        :style="panelStyles"
        role="tree"
      >
        <div v-if="!options.length" :class="ns.e('empty')">{{ emptyText }}</div>

        <div v-else :class="ns.e('columns')">
          <div
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
            :class="ns.e('column')"
            role="group"
          >
            <button
              v-for="node in column"
              :key="String(nodeValue(node, fields))"
              :class="[
                ns.e('option'),
                ns.is('active', isActive(node, columnIndex)),
                ns.is('selected', isSelected(node)),
                ns.is('disabled', isNodeDisabled(node, fields))
              ]"
              type="button"
              role="treeitem"
              :aria-selected="isSelected(node)"
              :aria-expanded="
                nodeChildren(node, fields)?.length
                  ? isActive(node, columnIndex)
                  : undefined
              "
              :disabled="isNodeDisabled(node, fields)"
              @click="handleNodeClick(node, columnIndex)"
            >
              <span :class="ns.e('option-label')">{{ nodeLabel(node, fields) }}</span>
              <BiliIcon
                v-if="nodeChildren(node, fields)?.length"
                :class="ns.e('option-arrow')"
                name="chevron-right"
              />
              <BiliIcon
                v-else-if="isSelected(node)"
                :class="ns.e('option-check')"
                name="check"
              />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
