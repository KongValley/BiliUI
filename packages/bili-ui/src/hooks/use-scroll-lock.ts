import { onBeforeUnmount, watch, type Ref } from 'vue'

let lockCount = 0
let previousOverflow = ''
let previousPaddingRight = ''

const lock = () => {
  if (typeof document === 'undefined') return
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow
    previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  }
  lockCount += 1
}

const unlock = () => {
  if (typeof document === 'undefined') return
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow
    document.body.style.paddingRight = previousPaddingRight
  }
}

export function useScrollLock(active: Ref<boolean>): void {
  let locked = false

  watch(
    active,
    value => {
      if (value && !locked) {
        lock()
        locked = true
      } else if (!value && locked) {
        unlock()
        locked = false
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (locked) {
      unlock()
      locked = false
    }
  })
}
