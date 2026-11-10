<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig, useLocale } from '../../../hooks/use-config'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useId } from '../../../hooks/use-id'
import { useZIndex } from '../../../hooks/use-z-index'
import { useEventListener } from '../../../hooks/use-event-listener'
import { isTopOverlay, pushOverlay, removeOverlay } from '../../../hooks/use-overlay-stack'
import { formatTime, parseTime } from '../../../utils/date'
import BiliIcon from '../../icon/src/icon.vue'
import { timePickerProps } from './time-picker'

defineOptions({ name: 'BiliTimePicker' })

const props = defineProps(timePickerProps)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'visible-change': [visible: boolean]
  clear: []
}>()

const ns = useNamespace('time-picker')
const config = useConfig()
const locale = useLocale()
const displayPlaceholder = computed(() => props.placeholder || locale.value.selectTime)
const displayNowText = computed(() => props.nowText || locale.value.now)
const displayConfirmText = computed(() => props.confirmText || locale.value.confirm)
const { nextZIndex } = useZIndex()
const panelId = useId('bili-time-picker-panel')
const token = Symbol('bili-time-picker')

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const hourListRef = ref<HTMLElement | null>(null)
const minuteListRef = ref<HTMLElement | null>(null)
const secondListRef = ref<HTMLElement | null>(null)

const isOpen = ref(false)
const panelZIndex = ref(2000)
const hour = ref(0)
const minute = ref(0)
const second = ref(0)

const { floatingStyles, isPositioned } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-start',
  strategy: 'fixed',
  offset: 6
})

const mergedSize = computed(() => props.size ?? config.value.size)
const hasValue = computed(() => !!props.modelValue)
const panelStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  zIndex: panelZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const pad = (value: number) => String(value).padStart(2, '0')

const availableHours = computed(() => {
  const step = Math.max(1, Math.trunc(props.hourStep))
  const disabled = new Set(props.disabledHours?.() ?? [])
  return Array.from({ length: 24 }, (_, index) => index).filter(
    value => value % step === 0 && !disabled.has(value)
  )
})

const availableMinutes = computed(() => {
  const step = Math.max(1, Math.trunc(props.minuteStep))
  const disabled = new Set(props.disabledMinutes?.(hour.value) ?? [])
  return Array.from({ length: 60 }, (_, index) => index).filter(
    value => value % step === 0 && !disabled.has(value)
  )
})

const availableSeconds = computed(() => {
  if (!props.showSeconds) return []
  const step = Math.max(1, Math.trunc(props.secondStep))
  const disabled = new Set(props.disabledSeconds?.(hour.value, minute.value) ?? [])
  return Array.from({ length: 60 }, (_, index) => index).filter(
    value => value % step === 0 && !disabled.has(value)
  )
})

const canConfirm = computed(
  () =>
    availableHours.value.includes(hour.value) &&
    availableMinutes.value.includes(minute.value) &&
    (!props.showSeconds || availableSeconds.value.includes(second.value))
)

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const parsed = parseTime(props.modelValue)
  if (!parsed) return props.modelValue
  const date = new Date(2000, 0, 1, parsed.hour, parsed.minute, parsed.second)
  return formatTime(date, props.showSeconds)
})

const clampDraft = () => {
  if (!availableHours.value.includes(hour.value)) {
    hour.value = availableHours.value[0] ?? 0
  }
  if (!availableMinutes.value.includes(minute.value)) {
    minute.value = availableMinutes.value[0] ?? 0
  }
  if (props.showSeconds && !availableSeconds.value.includes(second.value)) {
    second.value = availableSeconds.value[0] ?? 0
  }
}

const syncDraft = () => {
  const parsed = parseTime(props.modelValue)
  const now = new Date()
  hour.value = parsed?.hour ?? now.getHours()
  minute.value = parsed?.minute ?? 0
  second.value = parsed?.second ?? 0
  clampDraft()
}

const scrollColumn = (el: HTMLElement | null) => {
  el?.querySelector<HTMLElement>(`.${ns.e('item')}.is-selected`)?.scrollIntoView({
    block: 'center'
  })
}

const scrollSelected = () => {
  void nextTick(() => {
    scrollColumn(hourListRef.value)
    scrollColumn(minuteListRef.value)
    scrollColumn(secondListRef.value)
  })
}

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  panelZIndex.value = props.zIndex ?? nextZIndex()
  syncDraft()
  pushOverlay(token)
  scrollSelected()
  emit('visible-change', true)
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  removeOverlay(token)
  emit('visible-change', false)
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const selectHour = (value: number) => {
  hour.value = value
  clampDraft()
  void nextTick(() => {
    scrollColumn(minuteListRef.value)
    scrollColumn(secondListRef.value)
  })
}

const selectMinute = (value: number) => {
  minute.value = value
  clampDraft()
  void nextTick(() => scrollColumn(secondListRef.value))
}

const selectSecond = (value: number) => {
  second.value = value
}

const confirm = () => {
  if (!canConfirm.value) return
  const date = new Date(2000, 0, 1, hour.value, minute.value, second.value)
  const value = formatTime(date, props.showSeconds)
  emit('update:modelValue', value)
  emit('change', value)
  close()
}

const setNow = () => {
  const now = new Date()
  hour.value = now.getHours()
  minute.value = now.getMinutes()
  second.value = now.getSeconds()
  clampDraft()
  scrollSelected()
}

const clear = () => {
  if (!hasValue.value) return
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  close()
}

useClickOutside([triggerRef, panelRef], () => close())

useEventListener(
  () => (typeof document !== 'undefined' ? document : undefined),
  'keydown',
  (event: KeyboardEvent) => {
    if (!isOpen.value || !isTopOverlay(token)) return
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      nextTick(() => triggerRef.value?.focus())
    }
  }
)

watch(
  () => [
    props.showSeconds,
    props.modelValue,
    props.disabledHours,
    props.disabledMinutes,
    props.disabledSeconds
  ],
  () => {
    if (isOpen.value) syncDraft()
  }
)

watch(
  () => props.zIndex,
  value => {
    if (value !== undefined) panelZIndex.value = value
  }
)

onBeforeUnmount(() => removeOverlay(token))

defineExpose({ open, close, focus: () => triggerRef.value?.focus() })
</script>

<template>
  <div
    ref="triggerRef"
    :class="[ns.b(), ns.m(mergedSize), ns.is('open', isOpen), ns.is('disabled', disabled)]"
    role="combobox"
    aria-haspopup="dialog"
    :aria-expanded="isOpen"
    :aria-controls="panelId"
    :tabindex="disabled ? -1 : 0"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
    @keydown.down.prevent="open"
  >
    <BiliIcon :class="ns.e('icon')" name="clock" />

    <span :class="[displayValue ? ns.e('value') : ns.e('placeholder')]">
      {{ displayValue || displayPlaceholder }}
    </span>

    <button
      v-if="clearable && hasValue && !disabled"
      type="button"
      :class="ns.e('clear')"
      :aria-label="locale.clearTime"
      @click.stop="clear"
    >
      <BiliIcon name="close-circle" />
    </button>
  </div>

  <Teleport to="body">
    <Transition :name="ns.transition('time-picker-fade')">
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        :class="[ns.e('panel'), popperClass]"
        :style="panelStyles"
        role="dialog"
      >
        <div :class="ns.e('columns')">
          <div :class="ns.e('column')">
            <span :class="ns.e('column-label')">{{ locale.hour }}</span>
            <div ref="hourListRef" :class="ns.e('list')">
              <button
                v-for="value in availableHours"
                :key="value"
                type="button"
                :class="[ns.e('item'), ns.is('selected', value === hour)]"
                @click="selectHour(value)"
              >
                {{ pad(value) }}
              </button>
            </div>
          </div>

          <div :class="ns.e('column')">
            <span :class="ns.e('column-label')">{{ locale.minute }}</span>
            <div ref="minuteListRef" :class="ns.e('list')">
              <button
                v-for="value in availableMinutes"
                :key="value"
                type="button"
                :class="[ns.e('item'), ns.is('selected', value === minute)]"
                @click="selectMinute(value)"
              >
                {{ pad(value) }}
              </button>
            </div>
          </div>

          <div v-if="showSeconds" :class="ns.e('column')">
            <span :class="ns.e('column-label')">{{ locale.second }}</span>
            <div ref="secondListRef" :class="ns.e('list')">
              <button
                v-for="value in availableSeconds"
                :key="value"
                type="button"
                :class="[ns.e('item'), ns.is('selected', value === second)]"
                @click="selectSecond(value)"
              >
                {{ pad(value) }}
              </button>
            </div>
          </div>
        </div>

        <div :class="ns.e('footer')">
          <button type="button" :class="ns.e('now')" @click="setNow">{{ displayNowText }}</button>
          <button type="button" :class="ns.e('confirm')" :disabled="!canConfirm" @click="confirm">
            {{ displayConfirmText }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
