import type { PropType } from 'vue'
import type { TreeFieldNames, TreeKey, TreeOption } from '../../../utils/tree'

export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  /** Custom field names for label / value / children / disabled. */
  fieldNames: {
    type: Object as PropType<TreeFieldNames>,
    default: undefined
  },
  /** Key of the selected node (single selection). */
  modelValue: {
    type: [String, Number] as PropType<TreeKey | undefined>,
    default: undefined
  },
  selectable: {
    type: Boolean,
    default: true
  },
  /** Show checkboxes. */
  checkable: Boolean,
  /** Controlled checked keys (pair with `v-model:checked-keys`). */
  checkedKeys: {
    type: Array as PropType<TreeKey[]>,
    default: undefined
  },
  defaultCheckedKeys: {
    type: Array as PropType<TreeKey[]>,
    default: () => []
  },
  /** Controlled expanded keys (pair with `v-model:expanded-keys`). */
  expandedKeys: {
    type: Array as PropType<TreeKey[]>,
    default: undefined
  },
  defaultExpandedKeys: {
    type: Array as PropType<TreeKey[]>,
    default: () => []
  },
  defaultExpandAll: Boolean,
  /** Parent and children check independently. */
  checkStrictly: Boolean,
  /** Clicking a row toggles its expansion as well. */
  expandOnClickNode: Boolean,
  filterable: Boolean,
  filterPlaceholder: {
    type: String,
    default: '请输入关键字'
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  /** Indent per level, in px. */
  indent: {
    type: Number,
    default: 18
  }
} as const
