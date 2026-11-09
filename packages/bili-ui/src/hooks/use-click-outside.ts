import { onBeforeUnmount, onMounted, unref, type Ref } from 'vue'

export function useClickOutside(
  targets: Array<Ref<HTMLElement | null> | HTMLElement | null>,
  handler: (event: PointerEvent) => void
): void {
  const listener = (event: PointerEvent) => {
    const path = event.composedPath()
    const isInside = targets.some(target => {
      const el = target && 'value' in target ? unref(target) : target
      return !!el && path.includes(el as EventTarget)
    })
    if (!isInside) handler(event)
  }

  onMounted(() => {
    document.addEventListener('pointerdown', listener, true)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', listener, true)
  })
}
