<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig, useLocale, formatLocale } from '../../../hooks/use-config'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useId } from '../../../hooks/use-id'
import { useZIndex } from '../../../hooks/use-z-index'
import { useEventListener } from '../../../hooks/use-event-listener'
import { isTopOverlay, pushOverlay, removeOverlay } from '../../../hooks/use-overlay-stack'
import {
  addMonths,
  buildMonthCells,
  compareDateKeys,
  formatMonth,
  parseDate,
  parseMonth,
  todayKey
} from '../../../utils/date'
import BiliIcon from '../../icon/src/icon.vue'
import { datePickerProps, type DatePickerShortcut, type DatePickerValue } from './date-picker'

defineOptions({ name: 'BiliDatePicker' })

const props = defineProps(datePickerProps)

const emit = defineEmits<{
  'update:modelValue': [value: DatePickerValue]
  change: [value: DatePickerValue]
  'visible-change': [visible: boolean]
  clear: []
}>()

const ns = useNamespace('date-picker')
const config = useConfig()
const locale = useLocale()
const displayPlaceholder = computed(
  () => props.placeholder || locale.value.selectDate
)
const displayStartPlaceholder = computed(
  () => props.startPlaceholder || locale.value.startDate
)
const displayEndPlaceholder = computed(() => props.endPlaceholder || locale.value.endDate)
const displayRangeSeparator = computed(
  () => props.rangeSeparator || locale.value.rangeSeparator
)
const { nextZIndex } = useZIndex()
const panelId = useId('bili-date-picker-panel')
const token = Symbol('bili-date-picker')

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const panelZIndex = ref(2000)
const view = ref<'day' | 'month' | 'year'>('day')
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())
const pendingStart = ref<string | null>(null)
const hoverKey = ref('')
const pendingDayKey = ref('')
const time = ref({ hour: 0, minute: 0, second: 0 })

const { floatingStyles, isPositioned } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-start',
  strategy: 'fixed',
  offset: 6
})

const isRange = computed(() => props.type === 'daterange')
const isMonth = computed(() => props.type === 'month')
const isYear = computed(() => props.type === 'year')
const isDateTime = computed(() => props.type === 'datetime')
const mergedSize = computed(() => props.size ?? config.value.size)
const singleKey = computed(() => (typeof props.modelValue === 'string' ? props.modelValue : ''))
const datePart = computed(() => singleKey.value.split(' ')[0] ?? '')
const timePart = computed(() => singleKey.value.split(' ')[1] ?? '')
const rangeKeys = computed<[string, string] | null>(() =>
  Array.isArray(props.modelValue) ? props.modelValue : null
)
const hasValue = computed(() =>
  isRange.value ? !!(rangeKeys.value?.[0] && rangeKeys.value[1]) : !!singleKey.value
)

const selectedDate = computed(() => {
  if (isRange.value) {
    const key = rangeKeys.value?.[0]
    return key ? parseDate(key) : null
  }

  if (isMonth.value) {
    const parsed = parseMonth(singleKey.value)
    return parsed ? new Date(parsed.year, parsed.month, 1) : null
  }

  if (isYear.value) {
    const year = Number(singleKey.value)
    return singleKey.value.length === 4 && Number.isFinite(year) ? new Date(year, 0, 1) : null
  }

  const key = isDateTime.value ? datePart.value : singleKey.value
  return key ? parseDate(key) : null
})

const displayText = computed(() => {
  if (isRange.value) {
    const range = rangeKeys.value
    if (!range?.[0] || !range[1]) return ''
    return `${range[0]} ${displayRangeSeparator.value} ${range[1]}`
  }
  return singleKey.value
})

const panelStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  zIndex: panelZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const label = computed(() => {
  if (view.value === 'day') {
    return formatLocale(locale.value.yearMonth, {
      year: viewYear.value,
      month: viewMonth.value + 1
    })
  }
  if (view.value === 'month') {
    return formatLocale(locale.value.yearLabel, { year: viewYear.value })
  }
  const start = Math.floor(viewYear.value / 10) * 10
  return `${start} - ${start + 9}`
})

const weekdays = computed(() => {
  const labels = locale.value.weekdays
  const start = ((props.firstDayOfWeek % 7) + 7) % 7
  return [...labels.slice(start), ...labels.slice(0, start)]
})

const activeRange = computed<[string, string] | null>(() => {
  if (!isRange.value) return null
  if (pendingStart.value) {
    const hover = hoverKey.value || pendingStart.value
    return compareDateKeys(pendingStart.value, hover) <= 0
      ? [pendingStart.value, hover]
      : [hover, pendingStart.value]
  }
  if (rangeKeys.value?.[0] && rangeKeys.value[1]) return rangeKeys.value
  return null
})

const cells = computed(() => {
  const base = buildMonthCells({
    year: viewYear.value,
    month: viewMonth.value,
    firstDayOfWeek: props.firstDayOfWeek,
    todayKey: todayKey(),
    selectedKey: isRange.value
      ? ''
      : isDateTime.value
        ? pendingDayKey.value || datePart.value
        : singleKey.value,
    disabledDate: props.disabledDate
  })

  if (!isRange.value) {
    return base.map(cell => ({
      ...cell,
      inRange: false,
      rangeStart: false,
      rangeEnd: false
    }))
  }

  const start = activeRange.value?.[0] ?? ''
  const end = activeRange.value?.[1] ?? ''
  return base.map(cell => {
    const inRange = !!start && !!end && cell.key >= start && cell.key <= end
    return {
      ...cell,
      selected: inRange && (cell.key === start || cell.key === end),
      inRange,
      rangeStart: cell.key === start,
      rangeEnd: cell.key === end
    }
  })
})

const months = computed(() => Array.from({ length: 12 }, (_, index) => index + 1))
const decadeStart = computed(() => Math.floor(viewYear.value / 10) * 10)
const years = computed(() => Array.from({ length: 12 }, (_, index) => decadeStart.value + index))

const isSelectedMonth = (month: number) =>
  !!selectedDate.value &&
  selectedDate.value.getFullYear() === viewYear.value &&
  selectedDate.value.getMonth() === month - 1

const isSelectedYear = (year: number) => selectedDate.value?.getFullYear() === year

const resetView = () => {
  const date = selectedDate.value ?? new Date()
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
  view.value = isYear.value ? 'year' : isMonth.value ? 'month' : 'day'
}

const resetTime = () => {
  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(timePart.value)
  time.value = match
    ? { hour: Number(match[1]), minute: Number(match[2]), second: Number(match[3] ?? 0) }
    : { hour: 0, minute: 0, second: 0 }
}

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  panelZIndex.value = props.zIndex ?? nextZIndex()
  pendingStart.value = null
  pendingDayKey.value = isDateTime.value ? datePart.value || todayKey() : ''
  hoverKey.value = ''
  resetTime()
  resetView()
  pushOverlay(token)
  emit('visible-change', true)
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  pendingStart.value = null
  hoverKey.value = ''
  removeOverlay(token)
  emit('visible-change', false)
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const emitValue = (value: DatePickerValue) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const clear = () => {
  if (!hasValue.value) return
  emitValue(null)
  emit('clear')
  close()
}

const handlePrev = () => {
  if (view.value === 'day') {
    const next = addMonths(new Date(viewYear.value, viewMonth.value, 1), -1)
    viewYear.value = next.getFullYear()
    viewMonth.value = next.getMonth()
  } else if (view.value === 'month') {
    viewYear.value -= 1
  } else {
    viewYear.value -= 10
  }
}

const handleNext = () => {
  if (view.value === 'day') {
    const next = addMonths(new Date(viewYear.value, viewMonth.value, 1), 1)
    viewYear.value = next.getFullYear()
    viewMonth.value = next.getMonth()
  } else if (view.value === 'month') {
    viewYear.value += 1
  } else {
    viewYear.value += 10
  }
}

const cycleView = () => {
  if (isYear.value) return
  if (view.value === 'day') view.value = 'month'
  else if (view.value === 'month') view.value = 'year'
}

const selectMonth = (month: number) => {
  if (isMonth.value) {
    emitValue(formatMonth(viewYear.value, month - 1))
    close()
    return
  }
  viewMonth.value = month - 1
  view.value = 'day'
}

const selectYear = (year: number) => {
  viewYear.value = year
  if (isYear.value) {
    emitValue(String(year))
    close()
    return
  }
  view.value = 'month'
}

const selectRange = (key: string) => {
  if (!pendingStart.value) {
    pendingStart.value = key
    hoverKey.value = key
    return
  }
  const start = compareDateKeys(pendingStart.value, key) <= 0 ? pendingStart.value : key
  const end = compareDateKeys(pendingStart.value, key) <= 0 ? key : pendingStart.value
  pendingStart.value = null
  hoverKey.value = ''
  emitValue([start, end])
  close()
}

const handleDay = (key: string, disabled: boolean) => {
  if (disabled) return
  if (isRange.value) {
    selectRange(key)
    return
  }
  if (isDateTime.value) {
    pendingDayKey.value = key
    return
  }
  emitValue(key)
  close()
}

const pad = (value: number) => String(value).padStart(2, '0')

const confirmDateTime = () => {
  const date = pendingDayKey.value || todayKey()
  const { hour, minute, second } = time.value
  emitValue(`${date} ${pad(hour)}:${pad(minute)}:${pad(second)}`)
  close()
}

const handleDayHover = (key: string, disabled: boolean) => {
  if (!pendingStart.value || disabled) return
  hoverKey.value = key
}

const resolveShortcutValue = (shortcut: DatePickerShortcut): DatePickerValue => {
  return typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value
}

const isDisabledKey = (key: string) => {
  let date = parseDate(key)
  if (!date) {
    const month = parseMonth(key)
    if (month) date = new Date(month.year, month.month, 1)
    else if (/^\d{4}$/.test(key)) date = new Date(Number(key), 0, 1)
  }
  return !date || !!props.disabledDate?.(date)
}

const applyShortcut = (shortcut: DatePickerShortcut) => {
  const raw = resolveShortcutValue(shortcut)
  let value: DatePickerValue = null

  if (isRange.value) {
    if (Array.isArray(raw) && raw[0] && raw[1]) {
      value = [...raw].sort() as [string, string]
    } else if (typeof raw === 'string' && raw) {
      value = [raw, raw]
    }
  } else if (typeof raw === 'string' && raw) {
    value = raw
  } else if (Array.isArray(raw) && raw[0]) {
    value = raw[0]
  }

  if (!value) return
  const keys = Array.isArray(value) ? value : [value]
  if (keys.some(isDisabledKey)) return

  emitValue(value)
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
  () => props.modelValue,
  () => {
    if (!isOpen.value) resetView()
  },
  { deep: true }
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
    :class="[
      ns.b(),
      ns.m(mergedSize),
      ns.is('open', isOpen),
      ns.is('disabled', disabled),
      ns.is('range', isRange)
    ]"
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
    <BiliIcon :class="ns.e('icon')" name="calendar" />

    <span v-if="isRange" :class="ns.e('range')">
      <span :class="[ns.e('range-item'), ns.is('placeholder', !rangeKeys?.[0])]">
        {{ rangeKeys?.[0] || displayStartPlaceholder }}
      </span>
      <span :class="ns.e('separator')">{{ displayRangeSeparator }}</span>
      <span :class="[ns.e('range-item'), ns.is('placeholder', !rangeKeys?.[1])]">
        {{ rangeKeys?.[1] || displayEndPlaceholder }}
      </span>
    </span>

    <span v-else :class="[displayText ? ns.e('value') : ns.e('placeholder')]">
      {{ displayText || displayPlaceholder }}
    </span>

    <button
      v-if="clearable && hasValue && !disabled"
      type="button"
      :class="ns.e('clear')"
      :aria-label="locale.clearDate"
      @click.stop="clear"
    >
      <BiliIcon name="close-circle" />
    </button>
  </div>

  <Teleport to="body">
    <Transition :name="ns.transition('date-picker-fade')">
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        :class="[
          ns.e('panel'),
          popperClass,
          ns.is('with-shortcuts', shortcuts.length > 0),
          ns.is('datetime', isDateTime)
        ]"
        :style="panelStyles"
        role="dialog"
      >
        <div v-if="shortcuts.length" :class="ns.e('shortcuts')">
          <button
            v-for="shortcut in shortcuts"
            :key="shortcut.text"
            type="button"
            :class="ns.e('shortcut')"
            @click="applyShortcut(shortcut)"
          >
            {{ shortcut.text }}
          </button>
        </div>

        <div :class="ns.e('body')">
          <div :class="ns.e('header')">
            <button type="button" :class="ns.e('nav')" :aria-label="locale.prevMonth" @click="handlePrev">
              <BiliIcon name="chevron-left" />
            </button>
            <button
              type="button"
              :class="ns.e('label')"
              :disabled="view === 'year'"
              @click="cycleView"
            >
              {{ label }}
            </button>
            <button type="button" :class="ns.e('nav')" :aria-label="locale.nextMonth" @click="handleNext">
              <BiliIcon name="chevron-right" />
            </button>
          </div>

          <template v-if="view === 'day'">
            <div :class="ns.e('weekdays')">
              <span v-for="weekday in weekdays" :key="weekday" :class="ns.e('weekday')">
                {{ weekday }}
              </span>
            </div>
            <div :class="ns.e('days')" @mouseleave="hoverKey = ''">
              <button
                v-for="cell in cells"
                :key="cell.key"
                type="button"
                :class="[
                  ns.e('day'),
                  ns.is('outside', cell.outside),
                  ns.is('today', cell.today),
                  ns.is('selected', cell.selected),
                  ns.is('in-range', cell.inRange),
                  ns.is('range-start', cell.rangeStart),
                  ns.is('range-end', cell.rangeEnd),
                  ns.is('disabled', cell.disabled)
                ]"
                :aria-label="cell.key"
                :aria-selected="cell.selected"
                :disabled="cell.disabled"
                @mouseenter="handleDayHover(cell.key, cell.disabled)"
                @click="handleDay(cell.key, cell.disabled)"
              >
                {{ cell.day }}
              </button>
            </div>

            <div v-if="isDateTime" :class="ns.e('time')">
              <div :class="ns.e('time-fields')">
                <label :class="ns.e('time-field')">
                  <span>{{ locale.hour }}</span>
                  <select v-model.number="time.hour">
                    <option v-for="hour in 24" :key="hour" :value="hour - 1">
                      {{ pad(hour - 1) }}
                    </option>
                  </select>
                </label>
                <label :class="ns.e('time-field')">
                  <span>{{ locale.minute }}</span>
                  <select v-model.number="time.minute">
                    <option v-for="minute in 60" :key="minute" :value="minute - 1">
                      {{ pad(minute - 1) }}
                    </option>
                  </select>
                </label>
                <label :class="ns.e('time-field')">
                  <span>{{ locale.second }}</span>
                  <select v-model.number="time.second">
                    <option v-for="second in 60" :key="second" :value="second - 1">
                      {{ pad(second - 1) }}
                    </option>
                  </select>
                </label>
              </div>

              <button type="button" :class="ns.e('confirm')" @click="confirmDateTime">
                {{ locale.confirm }}
              </button>
            </div>
          </template>

          <div v-else-if="view === 'month'" :class="ns.e('months')">
            <button
              v-for="month in months"
              :key="month"
              type="button"
              :class="[ns.e('month'), ns.is('selected', isSelectedMonth(month))]"
              @click="selectMonth(month)"
            >
              {{ formatLocale(locale.monthLabel, { month }) }}
            </button>
          </div>

          <div v-else :class="ns.e('years')">
            <button
              v-for="year in years"
              :key="year"
              type="button"
              :class="[ns.e('year'), ns.is('selected', isSelectedYear(year))]"
              @click="selectYear(year)"
            >
              {{ year }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
