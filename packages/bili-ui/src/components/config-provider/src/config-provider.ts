import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'
import type { BiliLocale } from '../../../hooks/use-config'

export const configProviderProps = {
  /** Default control size for consuming components. */
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  /** Starting z-index used by overlay components. */
  zIndex: {
    type: Number,
    default: undefined
  },
  /** Partial locale overrides, merged with the parent/global locale. */
  locale: {
    type: Object as PropType<Partial<BiliLocale>>,
    default: undefined
  }
} as const
