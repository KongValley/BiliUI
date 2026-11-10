import type { PropType } from 'vue'

export const formListProps = {
  /** The array this list renders; pair with `v-model`. */
  modelValue: {
    type: Array as PropType<any[]>,
    default: () => []
  }
} as const
