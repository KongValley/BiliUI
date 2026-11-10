<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { calendarProps } from './calendar'
import { buildMonthCells, formatDate, parseDate, type CalendarCell } from './date'

defineOptions({ name: 'BiliCalendar' })

const props = defineProps(calendarProps)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'month-change': [year: number, month: number]
}>()

const ns = useNamespace('calendar')

const initial = parseDate(props.modelValue) ?? new Date()
const viewYear = ref(initial.getFullYear())
const viewMonth = ref(initial.getMonth())

const todayKey = computed(() => formatDate(new Date()))
const selectedKey = computed(() => (parseDate(props.modelValue) ? props.modelValue : ''))

const label = computed(() => `${viewYear.value} 年 ${viewMonth.value + 1} 月`)

const weekdays = computed(() => {
  const labels = ['日', '一', '二', '三', '四', '五', '六']
  const start = ((props.firstDayOfWeek % 7) + 7) % 7
  return [...labels.slice(start), ...labels.slice(0, start)]
})

const cells = computed(() =>
  buildMonthCells({
    year: viewYear.value,
    month: viewMonth.value,
    firstDayOfWeek: props.firstDayOfWeek,
    todayKey: todayKey.value,
    selectedKey: selectedKey.value,
    disabledDate: props.disabledDate
  })
)

const changeMonth = (delta: number) => {
  const next = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = next.getFullYear()
  viewMonth.value = next.getMonth()
  emit('month-change', next.getFullYear(), next.getMonth() + 1)
}

const selectDate = (date: Date) => {
  if (props.disabledDate?.(date)) return
  const key = formatDate(date)
  if (date.getFullYear() !== viewYear.value || date.getMonth() !== viewMonth.value) {
    viewYear.value = date.getFullYear()
    viewMonth.value = date.getMonth()
  }
  emit('update:modelValue', key)
  emit('change', key)
}

const handleCell = (cell: CalendarCell) => {
  if (cell.disabled) return
  selectDate(cell.date)
}

const selectToday = () => {
  const today = new Date()
  if (props.disabledDate?.(today)) return
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth()
  selectDate(today)
}

watch(
  () => props.modelValue,
  value => {
    const date = parseDate(value)
    if (!date) return
    viewYear.value = date.getFullYear()
    viewMonth.value = date.getMonth()
  }
)

const prevMonth = () => changeMonth(-1)
const nextMonth = () => changeMonth(1)

defineExpose({ prevMonth, nextMonth, selectToday })
</script>

<template>
  <div :class="ns.b()">
    <header :class="ns.e('header')">
      <div :class="ns.e('nav')">
        <button
          :class="ns.e('nav-button')"
          type="button"
          aria-label="上个月"
          @click="prevMonth"
        >
          <BiliIcon name="chevron-left" />
        </button>
        <button
          :class="ns.e('nav-button')"
          type="button"
          aria-label="下个月"
          @click="nextMonth"
        >
          <BiliIcon name="chevron-right" />
        </button>
      </div>

      <span :class="ns.e('label')">{{ label }}</span>

      <button
        v-if="showToday"
        :class="ns.e('today')"
        type="button"
        @click="selectToday"
      >
        {{ todayText }}
      </button>
    </header>

    <div :class="ns.e('weekdays')" role="row">
      <span v-for="weekday in weekdays" :key="weekday" :class="ns.e('weekday')">
        {{ weekday }}
      </span>
    </div>

    <div :class="ns.e('days')" role="grid">
      <button
        v-for="cell in cells"
        :key="cell.key"
        :class="[
          ns.e('day'),
          ns.is('outside', cell.outside),
          ns.is('today', cell.today),
          ns.is('selected', cell.selected),
          ns.is('disabled', cell.disabled)
        ]"
        type="button"
        role="gridcell"
        :aria-label="cell.key"
        :aria-selected="cell.selected"
        :disabled="cell.disabled"
        @click="handleCell(cell)"
      >
        {{ cell.day }}
      </button>
    </div>
  </div>
</template>
