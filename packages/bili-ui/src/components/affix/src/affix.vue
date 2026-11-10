<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  type CSSProperties
} from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { affixProps } from './affix'

defineOptions({ name: 'BiliAffix' })

const props = defineProps(affixProps)

const emit = defineEmits<{
  change: [fixed: boolean]
}>()

const ns = useNamespace('affix')

const rootRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const targetEl = ref<HTMLElement | null>(null)
const fixed = ref(false)
const fixedTop = ref(0)
const fixedBottom = ref(0)
const fixedLeft = ref(0)
const size = reactive({ width: 0, height: 0 })

let listeningTarget: HTMLElement | Window | null = null
let ticking = false
let observer: ResizeObserver | null = null

const resolveTarget = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null
  const { target } = props
  if (!target) return null
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target)
  return target
}

const setFixed = (value: boolean) => {
  if (fixed.value === value) return
  fixed.value = value
  emit('change', value)
}

const update = () => {
  if (typeof window === 'undefined') return
  const root = rootRef.value
  const content = contentRef.value
  if (!root || !content) return

  const rootRect = root.getBoundingClientRect()
  const contentRect = content.getBoundingClientRect()
  const width = contentRect.width || rootRect.width
  const height = contentRect.height || rootRect.height
  size.width = width
  size.height = height

  if (!width && !height) {
    setFixed(false)
    return
  }

  const viewportHeight = window.innerHeight
  const targetRect = targetEl.value?.getBoundingClientRect()

  if (props.position === 'top') {
    if (rootRect.top >= props.offset) {
      setFixed(false)
      return
    }

    let top = props.offset
    if (targetRect) {
      top = Math.max(top, targetRect.top)
      top = Math.min(top, targetRect.bottom - height)
    }

    fixedTop.value = top
    fixedLeft.value = rootRect.left
    setFixed(true)
    return
  }

  if (rootRect.bottom <= viewportHeight - props.offset) {
    setFixed(false)
    return
  }

  let bottom = props.offset
  if (targetRect) {
    bottom = Math.max(bottom, viewportHeight - targetRect.bottom)
    bottom = Math.min(bottom, Math.max(0, viewportHeight - targetRect.top - height))
  }

  fixedBottom.value = bottom
  fixedLeft.value = rootRect.left
  setFixed(true)
}

const handleScroll = () => {
  if (ticking) return
  ticking = true
  const run = () => {
    ticking = false
    update()
  }
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
  else run()
}

const removeListeners = () => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  listeningTarget?.removeEventListener('scroll', handleScroll)
  listeningTarget = null
}

const syncListeners = () => {
  removeListeners()
  if (typeof window === 'undefined') return
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll)
  if (targetEl.value) {
    targetEl.value.addEventListener('scroll', handleScroll, { passive: true })
    listeningTarget = targetEl.value
  }
}

const observe = () => {
  observer?.disconnect()
  if (typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(() => update())
  if (rootRef.value) observer.observe(rootRef.value)
  if (contentRef.value) observer.observe(contentRef.value)
  if (targetEl.value) observer.observe(targetEl.value)
}

watch(
  () => [props.target, props.offset, props.position],
  () => {
    targetEl.value = resolveTarget()
    syncListeners()
    observe()
    void nextTick(update)
  }
)

onMounted(() => {
  targetEl.value = resolveTarget()
  syncListeners()
  observe()
  void nextTick(update)
})

onBeforeUnmount(() => {
  removeListeners()
  observer?.disconnect()
  observer = null
})

const rootStyle = computed<CSSProperties>(() =>
  fixed.value
    ? {
        '--bili-affix-width': `${size.width}px`,
        '--bili-affix-height': `${size.height}px`
      }
    : {}
)

const contentStyle = computed<CSSProperties>(() => {
  if (!fixed.value) return {}
  const style: CSSProperties = {
    '--bili-affix-left': `${fixedLeft.value}px`,
    '--bili-affix-width': `${size.width}px`,
    '--bili-affix-z-index': String(props.zIndex)
  }
  if (props.position === 'top') style['--bili-affix-top'] = `${fixedTop.value}px`
  else style['--bili-affix-bottom'] = `${fixedBottom.value}px`
  return style
})

defineExpose({ update, fixed })
</script>

<template>
  <div ref="rootRef" :class="[ns.b(), ns.is('fixed', fixed)]" :style="rootStyle">
    <div ref="contentRef" :class="[ns.e('content'), ns.is('fixed', fixed)]" :style="contentStyle">
      <slot />
    </div>
  </div>
</template>
