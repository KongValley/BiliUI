import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export const colorPickerProps = {
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: 'md'
  },
  disabled: Boolean,
  /** Extra class on the teleported panel, useful for per-instance theming. */
  popperClass: {
    type: String,
    default: ''
  },
  clearable: Boolean,
  /** Swatches shown below the picker. */
  presets: {
    type: Array as PropType<string[]>,
    default: () => [
      '#e0356b',
      '#fb7299',
      '#fa8c16',
      '#fadb14',
      '#52c41a',
      '#13c2c2',
      '#1677ff',
      '#722ed1',
      '#eb2f96',
      '#000000',
      '#595959',
      '#ffffff'
    ]
  }
} as const
