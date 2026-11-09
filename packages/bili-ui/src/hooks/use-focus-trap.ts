import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

export function useFocusTrap(container: Ref<HTMLElement | null>, active: Ref<boolean>) {
  let previousActive: HTMLElement | null = null
  let listening = false

  const getFocusable = (): HTMLElement[] => {
    if (!container.value) return []
    return Array.from(
      container.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter(el => el.offsetParent !== null || el === document.activeElement)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !container.value) return
    const nodes = getFocusable()

    if (nodes.length === 0) {
      event.preventDefault()
      container.value.focus()
      return
    }

    const first = nodes[0]
    const last = nodes[nodes.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === first || document.activeElement === container.value) {
        event.preventDefault()
        last.focus()
      }
    } else if (document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const activate = async () => {
    previousActive = document.activeElement as HTMLElement | null
    await nextTick()
    const el = container.value
    if (!el) return
    const autofocus = el.querySelector<HTMLElement>('[autofocus]')
    ;(autofocus ?? el).focus()
    if (!listening) {
      document.addEventListener('keydown', handleKeydown, true)
      listening = true
    }
  }

  const deactivate = () => {
    if (listening) {
      document.removeEventListener('keydown', handleKeydown, true)
      listening = false
    }
    previousActive?.focus?.()
    previousActive = null
  }

  watch(active, value => void (value ? activate() : deactivate()), { immediate: true })

  onBeforeUnmount(deactivate)

  return { activate, deactivate }
}
