<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import {
  carouselContextKey,
  carouselProps,
  type CarouselContext,
  type CarouselDirection
} from './carousel'

defineOptions({ name: 'BiliCarousel' })

const props = defineProps(carouselProps)

const emit = defineEmits<{
  change: [current: number, prev: number]
}>()

const ns = useNamespace('carousel')

const items = reactive<number[]>([])
const activeIndex = ref(0)
const direction = computed<CarouselDirection>(() => props.direction)
const hovering = ref(false)
const ready = ref(false)

const containerStyle = computed(() => ({ height: props.height || undefined }))
const hasMultiple = computed(() => items.length > 1)
const showArrows = computed(() => hasMultiple.value && props.arrow !== 'never')

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

let timer: ReturnType<typeof setInterval> | null = null

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const canAutoplay = computed(() => props.autoplay && items.length > 1)

const startTimer = () => {
  stopTimer()
  if (!canAutoplay.value) return
  timer = setInterval(
    () => {
      if (props.pauseOnHover && hovering.value) return
      next()
    },
    Math.max(200, props.interval)
  )
}

const resetTimer = () => startTimer()

const addItem = (uid: number) => {
  if (!items.includes(uid)) items.push(uid)
}

const removeItem = (uid: number) => {
  const index = items.indexOf(uid)
  if (index === -1) return
  items.splice(index, 1)
  if (items.length === 0) {
    activeIndex.value = 0
    return
  }
  if (index < activeIndex.value) activeIndex.value -= 1
  else if (index === activeIndex.value) {
    activeIndex.value = clamp(activeIndex.value, 0, items.length - 1)
  }
}

const setActiveItem = (index: number) => {
  const length = items.length
  if (length === 0 || Number.isNaN(index)) return

  let target = Math.trunc(index)
  target = props.loop ? ((target % length) + length) % length : clamp(target, 0, length - 1)

  if (target === activeIndex.value) {
    resetTimer()
    return
  }

  const prev = activeIndex.value
  activeIndex.value = target
  emit('change', target, prev)
  resetTimer()
}

const next = () => {
  const length = items.length
  if (length === 0) return
  if (!props.loop && activeIndex.value >= length - 1) {
    stopTimer()
    return
  }
  setActiveItem(activeIndex.value + 1)
}

const prev = () => {
  const length = items.length
  if (length === 0) return
  if (!props.loop && activeIndex.value <= 0) return
  setActiveItem(activeIndex.value - 1)
}

const handleIndicatorEnter = (index: number) => {
  if (props.trigger === 'hover') setActiveItem(index)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!hasMultiple.value) return
  switch (event.key) {
    case 'ArrowLeft':
      if (props.direction !== 'horizontal') return
      event.preventDefault()
      prev()
      break
    case 'ArrowRight':
      if (props.direction !== 'horizontal') return
      event.preventDefault()
      next()
      break
    case 'ArrowUp':
      if (props.direction !== 'vertical') return
      event.preventDefault()
      prev()
      break
    case 'ArrowDown':
      if (props.direction !== 'vertical') return
      event.preventDefault()
      next()
      break
    case 'Home':
      event.preventDefault()
      setActiveItem(0)
      break
    case 'End':
      event.preventDefault()
      setActiveItem(items.length - 1)
      break
  }
}

watch(
  () => items.length,
  length => {
    if (length === 0) {
      activeIndex.value = 0
      stopTimer()
      return
    }
    if (activeIndex.value > length - 1) activeIndex.value = length - 1
    resetTimer()
  }
)

watch([canAutoplay, () => props.interval], () => startTimer(), {
  immediate: true,
  flush: 'post'
})

onMounted(() => {
  if (items.length) activeIndex.value = clamp(props.initialIndex, 0, items.length - 1)
  void nextTick(() => {
    ready.value = true
  })
})

onBeforeUnmount(stopTimer)

provide<CarouselContext>(carouselContextKey, {
  items,
  activeIndex,
  direction,
  addItem,
  removeItem
})

defineExpose({ activeIndex, setActiveItem, prev, next })
</script>

<template>
  <div
    :class="[ns.b(), ns.m(direction), ns.is('ready', ready), ns.is('hovering', hovering)]"
    role="region"
    aria-roledescription="carousel"
    tabindex="0"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @keydown="handleKeydown"
  >
    <div :class="ns.e('container')" :style="containerStyle">
      <slot />
    </div>

    <template v-if="showArrows">
      <button
        type="button"
        :class="[
          ns.e('arrow'),
          ns.e('arrow--prev'),
          ns.is('always', arrow === 'always'),
          ns.is('hover', arrow === 'hover')
        ]"
        aria-label="上一张"
        @click.stop="prev"
      >
        <BiliIcon :name="direction === 'vertical' ? 'chevron-up' : 'chevron-left'" />
      </button>
      <button
        type="button"
        :class="[
          ns.e('arrow'),
          ns.e('arrow--next'),
          ns.is('always', arrow === 'always'),
          ns.is('hover', arrow === 'hover')
        ]"
        aria-label="下一张"
        @click.stop="next"
      >
        <BiliIcon :name="direction === 'vertical' ? 'chevron-down' : 'chevron-right'" />
      </button>
    </template>

    <ul
      v-if="hasMultiple && indicatorPosition !== 'none'"
      :class="[
        ns.e('indicators'),
        ns.e(`indicators--${indicatorPosition}`),
        ns.is('vertical', direction === 'vertical' && indicatorPosition === 'inside')
      ]"
    >
      <li v-for="(item, index) in items" :key="item">
        <button
          type="button"
          :class="[ns.e('indicator'), ns.is('active', index === activeIndex)]"
          :aria-label="`切换到第 ${index + 1} 张`"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="setActiveItem(index)"
          @mouseenter="handleIndicatorEnter(index)"
        />
      </li>
    </ul>
  </div>
</template>
