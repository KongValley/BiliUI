<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
import type { Placement } from '@floating-ui/dom'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { useFloating } from '../../../hooks/use-floating'
import { useZIndex } from '../../../hooks/use-z-index'
import { useEventListener } from '../../../hooks/use-event-listener'
import { isTopOverlay, pushOverlay, removeOverlay } from '../../../hooks/use-overlay-stack'
import BiliIcon from '../../icon/src/icon.vue'
import { tourProps, type TourStep, type TourTarget } from './tour'

defineOptions({ name: 'BiliTour' })

const props = defineProps(tourProps)

const emit = defineEmits<{
  'update:modelValue': [index: number]
  change: [index: number]
  close: [index: number]
  finish: [index: number]
  next: [index: number]
  prev: [index: number]
}>()

const ns = useNamespace('tour')
const locale = useLocale()
const { nextZIndex } = useZIndex()
const token = Symbol('bili-tour')

const popoverRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)
const targetEl = ref<HTMLElement | null>(null)
const overlayZIndex = ref(2000)
const targetRect = ref<{
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
} | null>(null)
const viewport = ref({ width: 0, height: 0 })

let ticking = false

const steps = computed(() => props.steps)
const currentIndex = computed(() =>
  Math.min(Math.max(0, props.modelValue), Math.max(0, steps.value.length - 1))
)
const currentStep = computed<TourStep | undefined>(() => steps.value[currentIndex.value])
const visible = computed(
  () => steps.value.length > 0 && props.modelValue >= 0 && props.modelValue < steps.value.length
)
const isLast = computed(() => currentIndex.value >= steps.value.length - 1)

const placement = computed<Placement>(() => (currentStep.value?.placement ?? 'bottom') as Placement)

const { floatingStyles, arrowStyles, isPositioned } = useFloating(targetEl, popoverRef, {
  strategy: 'fixed',
  placement,
  arrowEl: arrowRef,
  offset: 12,
  padding: 8
})

const resolveTarget = (step?: TourStep): HTMLElement | null => {
  if (typeof document === 'undefined') return null
  const target: TourTarget | undefined = step?.target
  if (!target) return null
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target)
  if (typeof target === 'function') return target()
  return target
}

const updateTargetRect = () => {
  if (typeof window === 'undefined' || !visible.value) return
  viewport.value = { width: window.innerWidth, height: window.innerHeight }
  const el = targetEl.value
  if (!el) {
    targetRect.value = null
    return
  }
  const rect = el.getBoundingClientRect()
  targetRect.value = {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height
  }
}

const refresh = () => {
  if (!visible.value) return
  targetEl.value = resolveTarget(currentStep.value)
  if (targetEl.value && props.scrollIntoView) {
    targetEl.value.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
  }
  updateTargetRect()
  void nextTick(() => {
    updateTargetRect()
    popoverRef.value?.focus?.({ preventScroll: true })
  })
}

const scheduleRectUpdate = () => {
  if (!visible.value || ticking) return
  ticking = true
  const run = () => {
    ticking = false
    updateTargetRect()
  }
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
  else run()
}

const setCurrent = (index: number) => {
  const length = steps.value.length
  if (length === 0) return
  const next = Math.min(Math.max(0, index), length - 1)
  if (next === props.modelValue) return
  emit('update:modelValue', next)
  emit('change', next)
}

const next = () => {
  if (!visible.value) return
  if (isLast.value) {
    emit('finish', currentIndex.value)
    close()
    return
  }
  setCurrent(currentIndex.value + 1)
  emit('next', currentIndex.value + 1)
}

const prev = () => {
  if (!visible.value || currentIndex.value <= 0) return
  setCurrent(currentIndex.value - 1)
  emit('prev', currentIndex.value - 1)
}

const close = () => {
  if (!visible.value) return
  emit('update:modelValue', -1)
  emit('close', props.modelValue)
}

const goTo = (index: number) => setCurrent(index)

const handleMaskClick = () => {
  if (props.closeOnMaskClick) close()
}

const maskStyles = computed<CSSProperties[]>(() => {
  if (!visible.value || !props.mask) return []
  const zIndex = overlayZIndex.value
  if (!targetRect.value) {
    return [{ position: 'fixed', inset: '0', zIndex }]
  }

  const { width, height } = viewport.value
  const pad = Math.max(0, props.maskPadding)
  const top = Math.max(0, targetRect.value.top - pad)
  const left = Math.max(0, targetRect.value.left - pad)
  const right = Math.min(width, targetRect.value.right + pad)
  const bottom = Math.min(height, targetRect.value.bottom + pad)
  const rectHeight = Math.max(0, bottom - top)

  return [
    { position: 'fixed', top: '0', left: '0', width: '100%', height: `${top}px`, zIndex },
    {
      position: 'fixed',
      top: `${bottom}px`,
      left: '0',
      width: '100%',
      height: `${Math.max(0, height - bottom)}px`,
      zIndex
    },
    {
      position: 'fixed',
      top: `${top}px`,
      left: '0',
      width: `${left}px`,
      height: `${rectHeight}px`,
      zIndex
    },
    {
      position: 'fixed',
      top: `${top}px`,
      left: `${right}px`,
      width: `${Math.max(0, width - right)}px`,
      height: `${rectHeight}px`,
      zIndex
    }
  ]
})

const popoverStyle = computed<CSSProperties>(() => {
  const zIndex = overlayZIndex.value + 1
  if (!targetEl.value) {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex
    }
  }
  return {
    ...floatingStyles.value,
    zIndex,
    visibility: isPositioned.value ? 'visible' : 'hidden'
  }
})

watch(
  visible,
  value => {
    if (value) {
      overlayZIndex.value = props.zIndex ?? nextZIndex()
      pushOverlay(token)
      refresh()
    } else {
      removeOverlay(token)
      targetEl.value = null
      targetRect.value = null
    }
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  () => {
    if (visible.value) refresh()
  }
)

watch(
  () => props.steps,
  () => {
    if (visible.value) refresh()
  },
  { deep: true }
)

watch(
  () => props.zIndex,
  value => {
    if (value !== undefined) overlayZIndex.value = value
  }
)

useEventListener(
  () => (typeof document !== 'undefined' ? document : undefined),
  'keydown',
  (event: KeyboardEvent) => {
    if (!visible.value || !isTopOverlay(token)) return
    if (event.key === 'Escape' && props.closeOnPressEscape) {
      event.preventDefault()
      close()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prev()
    }
  }
)

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('scroll', scheduleRectUpdate, { passive: true, capture: true })
  window.addEventListener('resize', scheduleRectUpdate)
  if (visible.value) void nextTick(refresh)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', scheduleRectUpdate, true)
    window.removeEventListener('resize', scheduleRectUpdate)
  }
  removeOverlay(token)
})

defineExpose({ next, prev, close, goTo, currentIndex, visible })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" :class="[ns.b(), popperClass]">
      <div
        v-for="(style, index) in maskStyles"
        :key="index"
        :class="ns.e('mask')"
        :style="style"
        @click.stop="handleMaskClick"
      />

      <Transition name="bili-tour-fade" appear>
        <div
          ref="popoverRef"
          :class="ns.e('popover')"
          :style="popoverStyle"
          role="dialog"
          aria-modal="false"
          tabindex="-1"
        >
          <button
            v-if="showClose"
            type="button"
            :class="ns.e('close')"
            :aria-label="locale.close"
            @click="close"
          >
            <BiliIcon name="close" />
          </button>

          <span v-if="targetEl" ref="arrowRef" :class="ns.e('arrow')" :style="arrowStyles" />

          <div v-if="currentStep?.title || $slots.header" :class="ns.e('header')">
            <slot name="header" :step="currentStep" :index="currentIndex">
              {{ currentStep?.title }}
            </slot>
          </div>

          <div :class="ns.e('body')">
            <slot
              :step="currentStep"
              :index="currentIndex"
              :next="next"
              :prev="prev"
              :close="close"
            >
              {{ currentStep?.description }}
            </slot>
          </div>

          <div :class="ns.e('footer')">
            <div :class="ns.e('indicators')">
              <slot name="indicators" :steps="steps" :current="currentIndex" :go-to="goTo">
                <button
                  v-for="(step, index) in steps"
                  :key="index"
                  type="button"
                  :class="[ns.e('dot'), ns.is('active', index === currentIndex)]"
                  :aria-label="`第 ${index + 1} 步`"
                  @click="goTo(index)"
                />
              </slot>
            </div>

            <div :class="ns.e('actions')">
              <button
                v-if="currentIndex > 0"
                type="button"
                :class="[ns.e('button'), ns.e('button--prev')]"
                @click="prev"
              >
                {{ locale.prev }}
              </button>
              <button type="button" :class="[ns.e('button'), ns.e('button--next')]" @click="next">
                {{ isLast ? locale.finish : locale.next }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
