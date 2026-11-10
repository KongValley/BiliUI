import type { PropType } from 'vue'

export type ResultStatus = 'success' | 'warning' | 'info' | 'error' | '403' | '404' | '500'

export const resultProps = {
  status: {
    type: String as PropType<ResultStatus>,
    default: 'info'
  },
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  }
} as const

export type ResultProps = typeof resultProps
