<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { addUnit } from '../../../utils/dom'
import BiliIcon from '../../icon/src/icon.vue'
import { backTopProps } from './back-top'

defineOptions({ name: 'BiliBackTop' })

const props = defineProps(backTopProps)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const ns = useNamespace('back-top')
const locale = useLocale()

const targetEl = ref<HTMLElement | null>(null)
const visible = ref(false)
const ticking = ref(false)

let listeningTarget: HTMLElement | Window | null = null
let frame: number | null = null
let watchdog: ReturnType<typeof setTimeout> | null = null
let animationToken = 0

const resolveTarget = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null
  const { target } = props
  if (!target) return null
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target)
  return target
}

const getScrollTop = (): number => {
  if (targetEl.value) return targetEl.value.scrollTop
  if (typeof window === 'undefined') return 0
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
}

const setScrollTop = (top: number) => {
  if (targetEl.value) {
    const max = Math.max(0, targetEl.value.scrollHeight - targetEl.value.clientHeight)
    targetEl.value.scrollTop = Math.max(0, Math.min(top, max))
    return
  }
  if (typeof document === 'undefined') return
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const next = Math.max(0, Math.min(top, max))
  document.documentElement.scrollTop = next
  document.body.scrollTop = next
}

const updateVisible = () => {
  visible.value = getScrollTop() >= props.visibilityHeight
}

const handleScroll = () => {
  if (ticking.value) return
  ticking.value = true
  const run = () => {
    ticking.value = false
    updateVisible()
  }
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
  else run()
}

const removeListeners = () => {
  if (!listeningTarget) return
  listeningTarget.removeEventListener('scroll', handleScroll)
  if (typeof window !== 'undefined') window.removeEventListener('resize', handleScroll)
  listeningTarget = null
}

const syncListeners = () => {
  removeListeners()
  if (typeof window === 'undefined') return
  listeningTarget = targetEl.value ?? window
  listeningTarget.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll)
}

const cancelAnimation = () => {
  animationToken += 1
  if (frame !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame)
  if (watchdog !== null) {
    clearTimeout(watchdog)
    watchdog = null
  }
  frame = null
}

const scrollToTop = () => {
  const start = getScrollTop()
  cancelAnimation()

  if (start <= 0) return

  const duration = Math.max(0, props.duration)
  if (
    duration === 0 ||
    typeof requestAnimationFrame !== 'function' ||
    typeof performance === 'undefined'
  ) {
    setScrollTop(0)
    updateVisible()
    return
  }

  const token = animationToken
  const startTime = performance.now()

  const finish = () => {
    if (token !== animationToken) return
    animationToken += 1
    if (watchdog !== null) {
      clearTimeout(watchdog)
      watchdog = null
    }
    frame = null
    setScrollTop(0)
    updateVisible()
  }

  const step = (now: number) => {
    if (token !== animationToken) return
    const progress = Math.min(1, (now - startTime) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    setScrollTop(start * (1 - eased))
    if (progress < 1) frame = requestAnimationFrame(step)
    else finish()
  }

  frame = requestAnimationFrame(step)
  // Hidden tabs pause rAF; the watchdog still completes the scroll.
  watchdog = setTimeout(finish, duration + 80)
}

const handleClick = (event: MouseEvent) => {
  emit('click', event)
  scrollToTop()
}

const style = computed(() => ({
  [ns.cssVar('right')]: addUnit(props.right),
  [ns.cssVar('bottom')]: addUnit(props.bottom),
  [ns.cssVar('z-index')]: String(props.zIndex)
}))

watch(
  () => props.target,
  () => {
    targetEl.value = resolveTarget()
    syncListeners()
    updateVisible()
  }
)

onMounted(() => {
  targetEl.value = resolveTarget()
  syncListeners()
  updateVisible()
})

onBeforeUnmount(() => {
  removeListeners()
  cancelAnimation()
})

defineExpose({ visible, scrollToTop })
</script>

<template>
  <Transition :name="ns.transition('back-top')">
    <button
      v-if="visible"
      type="button"
      :class="ns.b()"
      :style="style"
      :aria-label="locale.backTop"
      @click="handleClick"
    >
      <slot>
        <BiliIcon name="chevron-up" />
      </slot>
    </button>
  </Transition>
</template>
