import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { StepStatus, StepsDirection } from './steps'

export interface StepsContext {
  active: Ref<number>
  direction: Ref<StepsDirection>
  processStatus: Ref<StepStatus>
  simple: Ref<boolean>
  clickable: Ref<boolean>
  register: (key: symbol) => void
  unregister: (key: symbol) => void
  indexOf: (key: symbol) => number
  /** Live count of mounted steps, used to detect the last one. */
  size: () => number
  go: (index: number) => void
}

export const stepsContextKey: InjectionKey<StepsContext> = Symbol('bili-steps')

export function useStepsContext(): StepsContext {
  const context = inject(stepsContextKey, null)
  if (!context) {
    throw new Error('[bili-ui] BiliStep must be used inside BiliSteps')
  }
  return context
}

export function provideStepsContext(context: StepsContext): void {
  provide(stepsContextKey, context)
}

/** Resolves a step's status from its index and the parent's active index. */
export function resolveStatus(
  index: number,
  active: number,
  processStatus: StepStatus
): StepStatus {
  if (index < active) return 'finish'
  if (index === active) return processStatus
  return 'wait'
}
