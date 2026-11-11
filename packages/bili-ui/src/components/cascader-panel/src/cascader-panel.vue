<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
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
import { cascaderPanelProps, type CascaderPanelValue } from './cascader-panel'

defineOptions({ name: 'BiliCascaderPanel' })

const props = defineProps(cascaderPanelProps)

const emit = defineEmits<{
  'update:modelValue': [value: CascaderPanelValue]
  change: [value: CascaderPanelValue, path: TreeOption[]]
}>()

const ns = useNamespace('cascader-panel')
const locale = useLocale()

const fields = computed(() => resolveTreeFields(props.fieldNames))
const displayEmpty = computed(() => props.emptyText || locale.value.empty)

const selectedPath = computed<TreeOption[]>(() => {
  if (props.modelValue === null || props.modelValue === undefined) return []
  return findNodePath(props.options, value => value === props.modelValue, fields.value) ?? []
})

const activePath = ref<TreeOption[]>([...selectedPath.value])

const columns = computed<TreeOption[][]>(() => {
  const result: TreeOption[][] = [props.options]
  for (const node of activePath.value) {
    const children = nodeChildren(node, fields.value)
    if (!children?.length) break
    result.push(children)
  }
  return result
})

const syncActivePath = () => {
  activePath.value = [...selectedPath.value]
}

watch(
  () => props.modelValue,
  () => syncActivePath()
)

watch(
  () => props.options,
  () => syncActivePath(),
  { deep: true }
)

const isActive = (node: TreeOption, level: number): boolean => {
  const active = activePath.value[level]
  return !!active && nodeValue(active, fields.value) === nodeValue(node, fields.value)
}

const isSelected = (node: TreeOption): boolean =>
  nodeValue(node, fields.value) === props.modelValue

const handleNodeClick = (node: TreeOption, level: number) => {
  if (isNodeDisabled(node, fields.value)) return

  const value = nodeValue(node, fields.value)
  if (value === undefined) return

  const path = [...activePath.value.slice(0, level), node]
  activePath.value = path

  const children = nodeChildren(node, fields.value)
  if (children?.length) {
    if (props.changeOnSelect) {
      emit('update:modelValue', value)
      emit('change', value, path)
    }
    return
  }

  emit('update:modelValue', value)
  emit('change', value, path)
}

defineExpose({ activePath, syncActivePath })
</script>

<template>
  <div :class="ns.b()" role="tree">
    <div v-if="!options.length" :class="ns.e('empty')">{{ displayEmpty }}</div>

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
            nodeChildren(node, fields)?.length ? isActive(node, columnIndex) : undefined
          "
          :disabled="isNodeDisabled(node, fields)"
          @click="handleNodeClick(node, columnIndex)"
        >
          <span :class="ns.e('label')">{{ nodeLabel(node, fields) }}</span>
          <BiliIcon
            v-if="nodeChildren(node, fields)?.length"
            :class="ns.e('arrow')"
            name="chevron-right"
          />
        </button>
      </div>
    </div>
  </div>
</template>
