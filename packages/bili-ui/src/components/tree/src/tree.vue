<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import {
  collectBranchKeys,
  collectSubtreeKeys,
  isNodeDisabled,
  nodeChildren,
  nodeLabel,
  nodeValue,
  resolveTreeFields,
  type TreeKey,
  type TreeOption
} from '../../../utils/tree'
import BiliIcon from '../../icon/src/icon.vue'
import BiliCheckbox from '../../checkbox/src/checkbox.vue'
import { treeProps } from './tree'

defineOptions({ name: 'BiliTree' })

const props = defineProps(treeProps)

const emit = defineEmits<{
  'update:modelValue': [key: TreeKey]
  'node-click': [node: TreeOption, key: TreeKey]
  'update:checkedKeys': [keys: TreeKey[]]
  'check-change': [node: TreeOption, checked: boolean, keys: TreeKey[]]
  'update:expandedKeys': [keys: TreeKey[]]
  'expand-change': [node: TreeOption, expanded: boolean]
}>()

const ns = useNamespace('tree')
const locale = useLocale()
const displayFilterPlaceholder = computed(
  () => props.filterPlaceholder || locale.value.searchPlaceholder
)
const displayEmpty = computed(() => props.emptyText || locale.value.empty)

const fields = computed(() => resolveTreeFields(props.fieldNames))
const query = ref('')

const innerExpanded = ref<TreeKey[]>([...props.defaultExpandedKeys])
const innerChecked = ref<TreeKey[]>([...props.defaultCheckedKeys])

const expandedKeysValue = computed(() => props.expandedKeys ?? innerExpanded.value)
const checkedKeysValue = computed(() => props.checkedKeys ?? innerChecked.value)
const expandedSet = computed(() => new Set(expandedKeysValue.value))
const checkedSet = computed(() => new Set(checkedKeysValue.value))

interface NodeMeta {
  node: TreeOption
  key: TreeKey
  parentKey?: TreeKey
  children: TreeKey[]
}

const metaMap = computed(() => {
  const map = new Map<TreeKey, NodeMeta>()
  const walk = (nodes: TreeOption[], parentKey?: TreeKey) => {
    nodes.forEach(node => {
      const key = nodeValue(node, fields.value)
      if (key === undefined) return
      const childNodes = nodeChildren(node, fields.value) ?? []
      const children = childNodes
        .map(child => nodeValue(child, fields.value))
        .filter((child): child is TreeKey => child !== undefined)
      map.set(key, { node, key, parentKey, children })
      walk(childNodes, key)
    })
  }
  walk(props.data)
  return map
})

interface FlatNode {
  node: TreeOption
  key: TreeKey
  level: number
  parentKey?: TreeKey
  hasChildren: boolean
  matched: boolean
}

const visibleNodes = computed<FlatNode[]>(() => {
  const keyword = query.value.trim().toLowerCase()
  const show = new Set<TreeKey>()
  const matched = new Set<TreeKey>()

  if (keyword) {
    const collect = (nodes: TreeOption[], trail: TreeKey[]) => {
      nodes.forEach(node => {
        const key = nodeValue(node, fields.value)
        if (key === undefined) return
        if (nodeLabel(node, fields.value).toLowerCase().includes(keyword)) {
          matched.add(key)
          show.add(key)
          trail.forEach(item => show.add(item))
        }
        collect(nodeChildren(node, fields.value) ?? [], [...trail, key])
      })
    }
    collect(props.data, [])
  }

  const result: FlatNode[] = []
  const walk = (nodes: TreeOption[], level: number, parentKey?: TreeKey) => {
    nodes.forEach(node => {
      const key = nodeValue(node, fields.value)
      if (key === undefined) return
      if (keyword && !show.has(key)) return
      const children = nodeChildren(node, fields.value) ?? []
      result.push({
        node,
        key,
        level,
        parentKey,
        hasChildren: children.length > 0,
        matched: matched.has(key)
      })
      if (children.length && (keyword || expandedSet.value.has(key))) {
        walk(children, level + 1, key)
      }
    })
  }
  walk(props.data, 0)
  return result
})

const isChecked = (key: TreeKey): boolean => checkedSet.value.has(key)

const hasCheckedDescendant = (key: TreeKey): boolean => {
  const meta = metaMap.value.get(key)
  if (!meta) return false
  return meta.children.some(child => {
    if (checkedSet.value.has(child)) return true
    return hasCheckedDescendant(child)
  })
}

const isIndeterminate = (node: TreeOption, key: TreeKey): boolean => {
  if (props.checkStrictly || checkedSet.value.has(key)) return false
  return hasCheckedDescendant(key)
}

const updateExpanded = (next: TreeKey[], node?: TreeOption, expanded?: boolean) => {
  if (props.expandedKeys === undefined) innerExpanded.value = next
  emit('update:expandedKeys', next)
  if (node && expanded !== undefined) emit('expand-change', node, expanded)
}

const toggleExpand = (node: TreeOption, key: TreeKey) => {
  const expanded = !expandedSet.value.has(key)
  const next = expanded
    ? [...new Set([...expandedSet.value, key])]
    : expandedKeysValue.value.filter(item => item !== key)
  updateExpanded(next, node, expanded)
}

const updateChecked = (next: TreeKey[], node?: TreeOption, checked?: boolean) => {
  if (props.checkedKeys === undefined) innerChecked.value = next
  emit('update:checkedKeys', next)
  if (node && checked !== undefined) emit('check-change', node, checked, next)
}

const toggleCheck = (node: TreeOption, key: TreeKey) => {
  if (isNodeDisabled(node, fields.value)) return
  const set = new Set(checkedSet.value)
  const willCheck = !set.has(key)

  if (props.checkStrictly) {
    if (willCheck) set.add(key)
    else set.delete(key)
  } else {
    const subtree = collectSubtreeKeys(node, fields.value)
    subtree.forEach(item => {
      if (willCheck) set.add(item)
      else set.delete(item)
    })

    // Recompute ancestors: fully checked when every direct child is checked.
    let parentKey = metaMap.value.get(key)?.parentKey
    while (parentKey !== undefined) {
      const parent = metaMap.value.get(parentKey)
      if (!parent) break
      const allChecked =
        parent.children.length > 0 &&
        parent.children.every(child => set.has(child))
      if (allChecked) set.add(parentKey)
      else set.delete(parentKey)
      parentKey = parent.parentKey
    }
  }

  updateChecked([...set], node, willCheck)
}

const selectNode = (node: TreeOption, key: TreeKey) => {
  if (!props.selectable || isNodeDisabled(node, fields.value)) return
  emit('update:modelValue', key)
  emit('node-click', node, key)
}

const handleNodeClick = (item: FlatNode) => {
  if (isNodeDisabled(item.node, fields.value)) return
  if (props.expandOnClickNode && item.hasChildren) {
    toggleExpand(item.node, item.key)
  }
  selectNode(item.node, item.key)
}

const handleNodeKeydown = (event: KeyboardEvent, item: FlatNode) => {
  if (event.key === 'ArrowRight' && item.hasChildren && !expandedSet.value.has(item.key)) {
    event.preventDefault()
    toggleExpand(item.node, item.key)
  } else if (
    event.key === 'ArrowLeft' &&
    item.hasChildren &&
    expandedSet.value.has(item.key)
  ) {
    event.preventDefault()
    toggleExpand(item.node, item.key)
  } else if ((event.key === 'Enter' || event.key === ' ') && !isNodeDisabled(item.node, fields.value)) {
    event.preventDefault()
    if (props.checkable) toggleCheck(item.node, item.key)
    else selectNode(item.node, item.key)
  }
}

const applyExpandAll = () => {
  if (props.expandedKeys !== undefined) return
  innerExpanded.value = collectBranchKeys(props.data, fields.value)
}

onMounted(() => {
  if (props.defaultExpandAll) applyExpandAll()
})

watch(
  () => props.defaultExpandAll,
  enabled => {
    if (enabled) applyExpandAll()
  }
)

watch(
  () => props.data,
  () => {
    if (props.defaultExpandAll) applyExpandAll()
  }
)

const expandAll = () => updateExpanded(collectBranchKeys(props.data, fields.value))
const collapseAll = () => updateExpanded([])
const clearChecked = () => updateChecked([])

defineExpose({ expandAll, collapseAll, clearChecked })
</script>

<template>
  <div :class="[ns.b(), ns.is('checkable', checkable)]" role="tree">
    <div v-if="filterable" :class="ns.e('filter')">
      <BiliIcon :class="ns.e('filter-icon')" name="search" />
      <input
        v-model="query"
        :class="ns.e('filter-input')"
        type="text"
        :placeholder="displayFilterPlaceholder"
        @keydown.esc="query = ''"
      />
    </div>

    <div v-if="visibleNodes.length" :class="ns.e('nodes')">
      <div
        v-for="item in visibleNodes"
        :key="item.key"
        :class="[
          ns.e('node'),
          ns.is('selected', modelValue === item.key),
          ns.is('disabled', isNodeDisabled(item.node, fields)),
          ns.is('expanded', expandedSet.has(item.key)),
          ns.is('matched', item.matched)
        ]"
        role="treeitem"
        :aria-selected="modelValue === item.key"
        :aria-expanded="item.hasChildren ? expandedSet.has(item.key) : undefined"
        :aria-checked="checkable ? isChecked(item.key) : undefined"
        :aria-disabled="isNodeDisabled(item.node, fields) || undefined"
        tabindex="0"
        :style="{ paddingLeft: `${8 + item.level * indent}px` }"
        @click="handleNodeClick(item)"
        @keydown="handleNodeKeydown($event, item)"
      >
        <button
          v-if="item.hasChildren"
          :class="ns.e('toggle')"
          type="button"
          tabindex="-1"
          :aria-label="expandedSet.has(item.key) ? locale.collapse : locale.expand"
          @click.stop="toggleExpand(item.node, item.key)"
        >
          <BiliIcon
            :class="[ns.e('toggle-icon'), ns.is('expanded', expandedSet.has(item.key))]"
            name="chevron-right"
          />
        </button>
        <span v-else :class="ns.e('toggle-placeholder')" aria-hidden="true" />

        <BiliCheckbox
          v-if="checkable"
          :class="ns.e('checkbox')"
          :model-value="isChecked(item.key)"
          :indeterminate="isIndeterminate(item.node, item.key)"
          :disabled="isNodeDisabled(item.node, fields)"
          @click.stop
          @change="() => toggleCheck(item.node, item.key)"
        />

        <span :class="[ns.e('label'), ns.is('matched', item.matched)]">
          {{ nodeLabel(item.node, fields) }}
        </span>
      </div>
    </div>

    <div v-else :class="ns.e('empty')">{{ displayEmpty }}</div>
  </div>
</template>
