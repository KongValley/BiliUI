import { inject, provide, type InjectionKey, type Ref } from 'vue'

export interface DescriptionsItemState {
  key: symbol
  label: string
  span: number
  labelWidth: string | number
}

export interface DescriptionsContext {
  column: Ref<number | 'auto'>
  labelWidth: Ref<string | number>
  bordered: Ref<boolean>
  direction: Ref<'horizontal' | 'vertical'>
  items: Ref<DescriptionsItemState[]>
  register: (item: DescriptionsItemState) => void
  unregister: (key: symbol) => void
  indexOf: (key: symbol) => number
}

export const descriptionsContextKey: InjectionKey<DescriptionsContext> =
  Symbol('bili-descriptions')

export function useDescriptionsContext(): DescriptionsContext {
  const context = inject(descriptionsContextKey, null)
  if (!context) {
    throw new Error('[bili-ui] BiliDescriptionsItem must be used inside BiliDescriptions')
  }
  return context
}

export function provideDescriptionsContext(context: DescriptionsContext): void {
  provide(descriptionsContextKey, context)
}
