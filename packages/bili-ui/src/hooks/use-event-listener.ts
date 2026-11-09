import { onBeforeUnmount, onMounted, unref, type Ref } from 'vue'

type EventTargetLike = Window | Document | HTMLElement | null | undefined

export function useEventListener(
  target: EventTargetLike | Ref<EventTargetLike> | (() => EventTargetLike),
  event: string,
  handler: (event: any) => void,
  options?: AddEventListenerOptions
): void {
  const getTarget = (): EventTargetLike => {
    if (typeof target === 'function') return target()
    return unref(target as Ref<EventTargetLike>)
  }

  onMounted(() => {
    getTarget()?.addEventListener(event, handler, options)
  })

  onBeforeUnmount(() => {
    getTarget()?.removeEventListener(event, handler, options)
  })
}
