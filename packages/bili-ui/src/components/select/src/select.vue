<script setup lang="ts">
import { computed, nextTick, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig, useLocale, formatLocale } from '../../../hooks/use-config'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useId } from '../../../hooks/use-id'
import { useZIndex } from '../../../hooks/use-z-index'
import { useFormItem } from '../../form/src/types'
import BiliIcon from '../../icon/src/icon.vue'
import BiliCheckbox from '../../checkbox/src/checkbox.vue'
import {
  isOptionGroup,
  selectProps,
  type SelectModelValue,
  type SelectOption,
  type SelectOptionGroup
} from './select'

defineOptions({ name: 'BiliSelect' })

const props = defineProps(selectProps)

const emit = defineEmits<{
  'update:modelValue': [value: SelectModelValue]
  change: [value: SelectModelValue, option: SelectOption | undefined]
  'visible-change': [visible: boolean]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const ns = useNamespace('select')
const locale = useLocale()
const config = useConfig()
const mergedSize = computed(() => props.size ?? config.value.size)
const displayPlaceholder = computed(() => props.placeholder || locale.value.selectPlaceholder)
const displayEmpty = computed(() => props.emptyText || locale.value.empty)
const formItem = useFormItem()
const { nextZIndex, currentZIndex } = useZIndex()
const panelId = useId('bili-select-panel')

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const filterRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const triggerWidth = ref(0)
const scrollTop = ref(0)
const remoteLoading = ref(false)
let remoteRequest = 0

const { floatingStyles, isPositioned } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-start',
  offset: 6
})

// ---------------------------------------------------------------------------
// Value model
// ---------------------------------------------------------------------------

const selectedValues = computed<Array<string | number>>(() => {
  const value = props.modelValue
  if (props.multiple) {
    return Array.isArray(value)
      ? (value.filter(item => item !== null && item !== undefined) as Array<string | number>)
      : []
  }
  return value === null || value === undefined || value === '' ? [] : [value as string | number]
})

const selectedValueSet = computed(() => new Set(selectedValues.value))

const sourceGroups = computed<SelectOptionGroup[]>(() =>
  props.options.map(item =>
    isOptionGroup(item)
      ? { label: item.label, options: item.options }
      : { label: '', options: [item] }
  )
)

const hasGroups = computed(() => sourceGroups.value.some(group => !!group.label))

const allOptions = computed(() => sourceGroups.value.flatMap(group => group.options))

const optionByValue = computed(() => {
  const map = new Map<string | number, SelectOption>()
  allOptions.value.forEach(option => map.set(option.value, option))
  return map
})

const selectedOptions = computed(() =>
  selectedValues.value
    .map(value => optionByValue.value.get(value))
    .filter((option): option is SelectOption => !!option)
)

const selectedOption = computed(() =>
  props.multiple ? selectedOptions.value[0] : optionByValue.value.get(selectedValues.value[0])
)

const visibleTags = computed(() =>
  props.maxTagCount === undefined
    ? selectedOptions.value
    : selectedOptions.value.slice(0, Math.max(0, props.maxTagCount))
)

const restTagCount = computed(() => selectedOptions.value.length - visibleTags.value.length)

const hasValue = computed(() => selectedValues.value.length > 0)

const showClear = computed(() => props.clearable && hasValue.value && !props.disabled)

const isLoading = computed(() => props.loading || remoteLoading.value)

// ---------------------------------------------------------------------------
// Filtering (local, custom or remote)
// ---------------------------------------------------------------------------

const matchesQuery = (option: SelectOption): boolean => {
  if (!query.value) return true
  if (props.filterMethod) return props.filterMethod(query.value, option)
  return option.label.toLowerCase().includes(query.value.toLowerCase())
}

const panelGroups = computed<SelectOptionGroup[]>(() => {
  if (!props.filterable || !query.value || props.remote) return sourceGroups.value
  return sourceGroups.value
    .map(group => ({ ...group, options: group.options.filter(matchesQuery) }))
    .filter(group => group.options.length > 0)
})

const flatVisibleOptions = computed(() => panelGroups.value.flatMap(group => group.options))

const optionIndexMap = computed(() => {
  const map = new Map<string | number, number>()
  flatVisibleOptions.value.forEach((option, index) => map.set(option.value, index))
  return map
})

// ---------------------------------------------------------------------------
// Virtual scrolling
// ---------------------------------------------------------------------------

const useVirtual = computed(() => {
  const enabled = props.virtual ?? flatVisibleOptions.value.length > props.virtualThreshold
  // Group headings have their own height, so grouped lists stay non-virtual.
  return enabled && !hasGroups.value
})

const overscan = 2

const visibleCount = computed(
  () => Math.ceil(props.panelMaxHeight / props.itemHeight) + overscan * 2
)

const startIndex = computed(() => {
  const maxStart = Math.max(0, flatVisibleOptions.value.length - 1)
  return Math.min(Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - overscan), maxStart)
})

const endIndex = computed(() =>
  Math.min(flatVisibleOptions.value.length, startIndex.value + visibleCount.value)
)

const virtualOptions = computed(() =>
  flatVisibleOptions.value.slice(startIndex.value, endIndex.value)
)

const topSpacerHeight = computed(() => startIndex.value * props.itemHeight)
const bottomSpacerHeight = computed(
  () => (flatVisibleOptions.value.length - endIndex.value) * props.itemHeight
)

const handleScroll = (event: Event) => {
  if (useVirtual.value) scrollTop.value = (event.target as HTMLElement).scrollTop
}

// ---------------------------------------------------------------------------
// Select all (multiple)
// ---------------------------------------------------------------------------

const selectableVisibleOptions = computed(() =>
  flatVisibleOptions.value.filter(option => !option.disabled)
)

const allSelected = computed(
  () =>
    selectableVisibleOptions.value.length > 0 &&
    selectableVisibleOptions.value.every(option => selectedValueSet.value.has(option.value))
)

const partiallySelected = computed(
  () =>
    !allSelected.value &&
    selectableVisibleOptions.value.some(option => selectedValueSet.value.has(option.value))
)

// ---------------------------------------------------------------------------
// Panel geometry
// ---------------------------------------------------------------------------

const panelStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  minWidth: `${triggerWidth.value}px`,
  zIndex: currentZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const scrollActiveIntoView = async () => {
  await nextTick()
  const list = listRef.value
  if (!list) return
  const option = list.querySelector<HTMLElement>(`[data-index="${activeIndex.value}"]`)
  option?.scrollIntoView({ block: 'nearest' })
}

const open = async () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  query.value = ''
  scrollTop.value = 0
  nextZIndex()
  triggerWidth.value = triggerRef.value?.getBoundingClientRect().width ?? 0
  emit('visible-change', true)

  const selectedIndex = flatVisibleOptions.value.findIndex(
    option => selectedValueSet.value.has(option.value) && !option.disabled
  )
  activeIndex.value = selectedIndex > -1 ? selectedIndex : 0
  scrollTop.value =
    useVirtual.value && activeIndex.value > 0
      ? Math.max(
          0,
          activeIndex.value * props.itemHeight -
            Math.floor(props.panelMaxHeight / props.itemHeight / 2) * props.itemHeight
        )
      : 0

  await nextTick()
  if (props.filterable) filterRef.value?.focus()
  if (listRef.value) listRef.value.scrollTop = scrollTop.value
  scrollActiveIntoView()
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  query.value = ''
  activeIndex.value = -1
  emit('visible-change', false)
}

const toggle = () => {
  if (isOpen.value) {
    close()
  } else {
    void open()
  }
}

const commit = (value: SelectModelValue, option?: SelectOption) => {
  emit('update:modelValue', value)
  emit('change', value, option)
  formItem?.validate('change')
}

const selectOption = (option: SelectOption) => {
  if (option.disabled) return

  if (props.multiple) {
    if (selectedValueSet.value.has(option.value)) {
      commit(
        selectedValues.value.filter(value => value !== option.value),
        option
      )
    } else {
      commit([...selectedValues.value, option.value], option)
    }
    return
  }

  commit(option.value, option)
  close()
  triggerRef.value?.focus()
}

const removeValue = (value: string | number) => {
  if (props.disabled) return
  const option = optionByValue.value.get(value)
  commit(
    selectedValues.value.filter(item => item !== value),
    option
  )
}

const toggleSelectAll = () => {
  const values = selectableVisibleOptions.value.map(option => option.value)
  if (allSelected.value) {
    commit(selectedValues.value.filter(value => !values.includes(value)))
    return
  }
  const set = new Set(selectedValues.value)
  values.forEach(value => set.add(value))
  commit([...set])
}

const clear = () => {
  commit(props.multiple ? [] : null)
  emit('clear')
  if (!props.multiple) close()
}

// ---------------------------------------------------------------------------
// Keyboard / input
// ---------------------------------------------------------------------------

const moveActive = (direction: 1 | -1) => {
  const options = flatVisibleOptions.value
  const length = options.length
  if (!length) return

  let next = activeIndex.value
  for (let step = 0; step < length; step += 1) {
    next = (next + direction + length) % length
    if (!options[next]?.disabled) break
  }
  activeIndex.value = next
  scrollActiveIntoView()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) void open()
      else moveActive(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      if (!isOpen.value) void open()
      else moveActive(-1)
      break
    case 'Enter':
      event.preventDefault()
      if (isOpen.value) {
        const option = flatVisibleOptions.value[activeIndex.value]
        if (option) selectOption(option)
      } else {
        void open()
      }
      break
    case 'Backspace':
      if (props.multiple && !query.value && selectedValues.value.length) {
        event.preventDefault()
        removeValue(selectedValues.value[selectedValues.value.length - 1])
      }
      break
    case 'Escape':
      if (isOpen.value) {
        event.preventDefault()
        close()
      }
      break
    case 'Tab':
      close()
      break
  }
}

const handleFilterInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  query.value = value
  if (props.remote && props.remoteMethod) {
    const requestId = ++remoteRequest
    remoteLoading.value = true
    Promise.resolve(props.remoteMethod(value)).finally(() => {
      if (requestId === remoteRequest) remoteLoading.value = false
    })
  }
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget as Node | null
  if (
    nextTarget &&
    (triggerRef.value?.contains(nextTarget) || panelRef.value?.contains(nextTarget))
  ) {
    return
  }
  emit('blur', event)
  formItem?.validate('blur')
  close()
}

watch(query, () => {
  scrollTop.value = 0
  if (listRef.value) listRef.value.scrollTop = 0
  const index = flatVisibleOptions.value.findIndex(option => !option.disabled)
  activeIndex.value = index > -1 ? index : 0
})

watch(
  () => props.disabled,
  disabled => {
    if (disabled) close()
  }
)

useClickOutside([triggerRef, panelRef], () => close())

const focus = () => triggerRef.value?.focus()
const blur = () => triggerRef.value?.blur()

defineExpose({ focus, blur, open, close })
</script>

<template>
  <div
    ref="triggerRef"
    :class="[
      ns.b(),
      ns.m(mergedSize),
      ns.is('multiple', multiple),
      ns.is('open', isOpen),
      ns.is('disabled', disabled)
    ]"
    role="combobox"
    aria-haspopup="listbox"
    :aria-expanded="isOpen"
    :aria-controls="panelId"
    :aria-multiselectable="multiple || undefined"
    :tabindex="disabled ? -1 : 0"
    @click="toggle"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <div :class="ns.e('content')">
      <template v-if="multiple">
        <div :class="ns.e('tags')">
          <span v-for="option in visibleTags" :key="option.value" :class="ns.e('tag')">
            <span :class="ns.e('tag-label')">{{ option.label }}</span>
            <button
              :class="ns.e('tag-close')"
              type="button"
              tabindex="-1"
              :aria-label="formatLocale(locale.removeItem, { label: option.label })"
              @mousedown.stop.prevent
              @click.stop="removeValue(option.value)"
            >
              <BiliIcon name="close" />
            </button>
          </span>
          <span v-if="restTagCount > 0" :class="[ns.e('tag'), ns.is('rest', true)]">
            +{{ restTagCount }}
          </span>
          <input
            v-if="filterable && isOpen"
            ref="filterRef"
            :class="ns.e('filter')"
            :value="query"
            :placeholder="selectedOptions.length ? '' : displayPlaceholder"
            @input="handleFilterInput"
            @click.stop
          />
          <span
            v-else-if="!selectedOptions.length"
            :class="[ns.e('value'), ns.is('placeholder', true)]"
          >
            {{ displayPlaceholder }}
          </span>
        </div>
      </template>

      <template v-else>
        <input
          v-if="filterable && isOpen"
          ref="filterRef"
          :class="ns.e('filter')"
          :value="query"
          :placeholder="selectedOption ? selectedOption.label : displayPlaceholder"
          @input="handleFilterInput"
          @click.stop
        />
        <span v-else :class="[ns.e('value'), ns.is('placeholder', !selectedOption)]">
          {{ selectedOption ? selectedOption.label : displayPlaceholder }}
        </span>
      </template>
    </div>

    <span :class="ns.e('suffix')">
      <button
        v-if="showClear"
        :class="ns.e('clear')"
        type="button"
        tabindex="-1"
        :aria-label="locale.clear"
        @click.stop="clear"
      >
        <BiliIcon name="close-circle" />
      </button>
      <BiliIcon :class="ns.e('arrow')" name="chevron-down" />
    </span>
  </div>

  <Teleport to="body">
    <Transition :name="ns.transition('select-dropdown')">
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        :class="[ns.e('panel'), popperClass]"
        :style="panelStyles"
        role="listbox"
        :aria-multiselectable="multiple || undefined"
      >
        <div v-if="multiple && selectAll" :class="ns.e('select-all')">
          <BiliCheckbox
            :model-value="allSelected"
            :indeterminate="partiallySelected"
            :disabled="!selectableVisibleOptions.length"
            @change="toggleSelectAll"
          >
            {{ locale.selectAll }}
          </BiliCheckbox>
          <span :class="ns.e('select-all-count')">
            {{ selectedValues.length }}/{{ selectableVisibleOptions.length }}
          </span>
        </div>

        <div
          ref="listRef"
          :class="[ns.e('list'), ns.is('virtual', useVirtual)]"
          :style="useVirtual ? { maxHeight: `${panelMaxHeight}px` } : undefined"
          @scroll="handleScroll"
        >
          <template v-if="useVirtual">
            <div :style="{ height: `${topSpacerHeight}px` }" aria-hidden="true" />
            <button
              v-for="(option, index) in virtualOptions"
              :key="option.value"
              :data-index="startIndex + index"
              :class="[
                ns.e('option'),
                ns.is('selected', selectedValueSet.has(option.value)),
                ns.is('active', startIndex + index === activeIndex),
                ns.is('disabled', option.disabled)
              ]"
              :style="{ height: `${itemHeight}px` }"
              type="button"
              role="option"
              :aria-selected="selectedValueSet.has(option.value)"
              :disabled="option.disabled"
              @mouseenter="activeIndex = startIndex + index"
              @click="selectOption(option)"
            >
              <span :class="ns.e('option-label')">{{ option.label }}</span>
              <BiliIcon
                v-if="selectedValueSet.has(option.value)"
                :class="ns.e('check')"
                name="check"
              />
            </button>
            <div :style="{ height: `${bottomSpacerHeight}px` }" aria-hidden="true" />
          </template>

          <template v-else>
            <template v-for="(group, groupIndex) in panelGroups" :key="group.label || groupIndex">
              <div v-if="group.label" :class="ns.e('group-label')" role="presentation">
                {{ group.label }}
              </div>
              <button
                v-for="option in group.options"
                :key="option.value"
                :data-index="optionIndexMap.get(option.value)"
                :class="[
                  ns.e('option'),
                  ns.is('selected', selectedValueSet.has(option.value)),
                  ns.is('active', optionIndexMap.get(option.value) === activeIndex),
                  ns.is('disabled', option.disabled)
                ]"
                type="button"
                role="option"
                :aria-selected="selectedValueSet.has(option.value)"
                :disabled="option.disabled"
                @mouseenter="activeIndex = optionIndexMap.get(option.value) ?? -1"
                @click="selectOption(option)"
              >
                <span :class="ns.e('option-label')">{{ option.label }}</span>
                <BiliIcon
                  v-if="selectedValueSet.has(option.value)"
                  :class="ns.e('check')"
                  name="check"
                />
              </button>
            </template>
          </template>

          <div v-if="isLoading" :class="ns.e('loading')">{{ locale.loading }}</div>
          <div v-else-if="!flatVisibleOptions.length" :class="ns.e('empty')">
            {{ displayEmpty }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
