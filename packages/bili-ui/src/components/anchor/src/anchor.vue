<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { anchorContextKey, anchorProps, type AnchorContext, type AnchorLinkState } from './anchor'

defineOptions({ name: 'BiliAnchor' })

const props = defineProps(anchorProps)

const emit = defineEmits<{
  change: [href: string]
  click: [event: MouseEvent, href: string]
}>()

const ns = useNamespace('anchor')

const links = reactive<AnchorLinkState[]>([])
const activeHref = ref('')
const scroller = ref<HTMLElement | null>(null)
const direction = computed(() => props.direction)
const marker = computed(() => props.marker)

let scrollTarget: HTMLElement | Window | null = null
let ticking = false
let animationFrame: number | null = null
let animationWatchdog: ReturnType<typeof setTimeout> | null = null
let animationToken = 0
let animating = false

const resolveScroller = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null
  const { container } = props
  if (!container) return null
  if (typeof container === 'string') return document.querySelector<HTMLElement>(container)
  return container
}

const getScrollTop = (): number => {
  if (scroller.value) return scroller.value.scrollTop
  if (typeof window === 'undefined') return 0
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
}

const setScrollTop = (top: number) => {
  if (scroller.value) {
    const max = Math.max(0, scroller.value.scrollHeight - scroller.value.clientHeight)
    scroller.value.scrollTop = Math.max(0, Math.min(top, max))
    return
  }
  if (typeof document === 'undefined') return
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const next = Math.max(0, Math.min(top, max))
  document.documentElement.scrollTop = next
  document.body.scrollTop = next
}

const isAtBottom = (): boolean => {
  if (scroller.value) {
    const el = scroller.value
    return (
      el.scrollHeight > el.clientHeight && el.scrollTop + el.clientHeight >= el.scrollHeight - 2
    )
  }
  if (typeof document === 'undefined') return false
  const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  return height > window.innerHeight && window.innerHeight + getScrollTop() >= height - 2
}

const setActive = (href: string) => {
  if (href === activeHref.value) return
  activeHref.value = href
  if (href) emit('change', href)
}

const sortedLinks = (): AnchorLinkState[] => {
  return links
    .filter(link => !!link.getEl())
    .slice()
    .sort((a, b) => {
      const aEl = a.getEl()
      const bEl = b.getEl()
      if (!aEl || !bEl || aEl === bEl) return 0
      const position = aEl.compareDocumentPosition(bEl)
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
      return 0
    })
}

const updateActive = () => {
  const available = sortedLinks()
  if (available.length === 0) {
    setActive('')
    return
  }

  const first = available[0].href
  const containerTop = scroller.value ? scroller.value.getBoundingClientRect().top : 0
  const threshold = containerTop + props.offset + props.bound

  let current = ''
  let hasLayout = false

  for (const link of available) {
    const el = link.getEl()
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top !== 0 || rect.height !== 0) hasLayout = true
    if (rect.top <= threshold) current = link.href
  }

  // jsdom and hidden containers report all-zero rects; keep the first link active.
  if (!hasLayout || !current) current = first
  if (isAtBottom()) current = available[available.length - 1].href

  setActive(current)
}

const handleScroll = () => {
  if (animating || ticking) return
  ticking = true
  const run = () => {
    ticking = false
    updateActive()
  }
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
  else run()
}

const removeListeners = () => {
  if (!scrollTarget) return
  scrollTarget.removeEventListener('scroll', handleScroll)
  if (typeof window !== 'undefined') window.removeEventListener('resize', handleScroll)
  scrollTarget = null
}

const syncListeners = () => {
  removeListeners()
  if (typeof window === 'undefined') return
  scrollTarget = scroller.value ?? window
  scrollTarget.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll)
}

const cancelAnimation = () => {
  animationToken += 1
  if (animationFrame !== null && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(animationFrame)
  }
  if (animationWatchdog !== null) {
    clearTimeout(animationWatchdog)
    animationWatchdog = null
  }
  animationFrame = null
  animating = false
}

const scrollTo = (href: string) => {
  if (typeof document === 'undefined') return
  const el = document.getElementById(href.replace(/^#/, ''))
  if (!el) return

  const containerRect = scroller.value?.getBoundingClientRect()
  const targetTop = scroller.value
    ? scroller.value.scrollTop + el.getBoundingClientRect().top - containerRect!.top - props.offset
    : getScrollTop() + el.getBoundingClientRect().top - props.offset

  setActive(href)
  cancelAnimation()

  const start = getScrollTop()
  const distance = targetTop - start
  const duration = Math.max(0, props.duration)

  if (
    duration === 0 ||
    distance === 0 ||
    typeof requestAnimationFrame !== 'function' ||
    typeof performance === 'undefined'
  ) {
    setScrollTop(targetTop)
    updateActive()
    return
  }

  animating = true
  const token = animationToken
  const startTime = performance.now()

  const finish = () => {
    if (token !== animationToken) return
    // Invalidate pending frames so a resumed compositor cannot restart the tween.
    animationToken += 1
    if (animationWatchdog !== null) {
      clearTimeout(animationWatchdog)
      animationWatchdog = null
    }
    animationFrame = null
    animating = false
    setScrollTop(targetTop)
    updateActive()
  }

  const step = (now: number) => {
    if (token !== animationToken) return
    const progress = Math.min(1, (now - startTime) / duration)
    const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2
    if (progress < 1) {
      setScrollTop(start + distance * eased)
      animationFrame = requestAnimationFrame(step)
    } else {
      finish()
    }
  }

  animationFrame = requestAnimationFrame(step)
  // Hidden tabs pause rAF; the watchdog still completes the scroll when the frame never arrives.
  animationWatchdog = setTimeout(finish, duration + 80)
}

const handleClick = (event: MouseEvent, href: string) => {
  if (typeof document === 'undefined') return
  if (!document.getElementById(href.replace(/^#/, ''))) return
  event.preventDefault()
  scrollTo(href)
  emit('click', event, href)
}

const registerLink = (link: AnchorLinkState) => {
  const index = links.findIndex(item => item.href === link.href)
  if (index > -1) links[index] = link
  else links.push(link)
}

const unregisterLink = (href: string) => {
  const index = links.findIndex(item => item.href === href)
  if (index === -1) return
  links.splice(index, 1)
  if (activeHref.value === href) {
    activeHref.value = ''
    updateActive()
  }
}

const activeChain = computed(() => {
  const chain = new Set<string>()
  let current = activeHref.value
  let guard = 0
  while (current && guard <= links.length) {
    chain.add(current)
    const link = links.find(item => item.href === current)
    current = link?.parent ?? ''
    guard += 1
  }
  return chain
})

const isActive = (href: string) => activeChain.value.has(href)
const isExactActive = (href: string) => href === activeHref.value

watch(
  () => props.container,
  () => {
    scroller.value = resolveScroller()
    syncListeners()
    updateActive()
  }
)

watch(
  () => links.length,
  () => {
    void nextTick(updateActive)
  }
)

onMounted(() => {
  scroller.value = resolveScroller()
  syncListeners()
  void nextTick(updateActive)
})

onBeforeUnmount(() => {
  removeListeners()
  cancelAnimation()
})

provide<AnchorContext>(anchorContextKey, {
  direction,
  marker,
  activeHref,
  isActive,
  isExactActive,
  registerLink,
  unregisterLink,
  handleClick
})

defineExpose({ activeHref, scrollTo })
</script>

<template>
  <nav :class="[ns.b(), ns.m(direction)]" aria-label="锚点导航">
    <div :class="ns.e('list')" role="list">
      <slot />
    </div>
  </nav>
</template>
