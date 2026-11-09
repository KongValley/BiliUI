<script setup lang="ts">
import { computed, nextTick, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useId } from '../../../hooks/use-id'
import { useZIndex } from '../../../hooks/use-z-index'
import { useFormItem } from '../../form/src/types'
import BiliIcon from '../../icon/src/icon.vue'
import { selectProps, type SelectOption, type SelectValue } from './select'

defineOptions({ name: 'BiliSelect' })

const props = defineProps(selectProps)

const emit = defineEmits<{
  'update:modelValue': [value: SelectValue]
  change: [value: SelectValue, option: SelectOption | undefined]
  'visible-change': [visible: boolean]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const ns = useNamespace('select')
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

const { floatingStyles, isPositioned } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-start',
  offset: 6
})

const selectedOption = computed(() =>
  props.options.find(option => option.value === props.modelValue)
)

const hasValue = computed(
  () => props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''
)

const showClear = computed(() => props.clearable && hasValue.value && !props.disabled)

const filteredOptions = computed(() => {
  if (!props.filterable || !query.value) return props.options
  const keyword = query.value.toLowerCase()
  return props.options.filter(option => option.label.toLowerCase().includes(keyword))
})

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
  nextZIndex()
  triggerWidth.value = triggerRef.value?.getBoundingClientRect().width ?? 0
  emit('visible-change', true)

  const selectedIndex = props.options.findIndex(
    option => option.value === props.modelValue && !option.disabled
  )
  activeIndex.value = selectedIndex > -1 ? selectedIndex : 0

  await nextTick()
  if (props.filterable) filterRef.value?.focus()
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

const selectOption = (option: SelectOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value, option)
  formItem?.validate('change')
  close()
  triggerRef.value?.focus()
}

const clear = () => {
  emit('update:modelValue', null)
  emit('change', null, undefined)
  emit('clear')
  formItem?.validate('change')
  close()
}

const moveActive = (direction: 1 | -1) => {
  const options = filteredOptions.value
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
        const option = filteredOptions.value[activeIndex.value]
        if (option) selectOption(option)
      } else {
        void open()
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
  query.value = (event.target as HTMLInputElement).value
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
  const index = filteredOptions.value.findIndex(option => !option.disabled)
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
      ns.m(size),
      ns.is('open', isOpen),
      ns.is('disabled', disabled)
    ]"
    role="combobox"
    aria-haspopup="listbox"
    :aria-expanded="isOpen"
    :aria-controls="panelId"
    :tabindex="disabled ? -1 : 0"
    @click="toggle"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <div :class="ns.e('content')">
      <input
        v-if="filterable && isOpen"
        ref="filterRef"
        :class="ns.e('filter')"
        :value="query"
        :placeholder="selectedOption ? selectedOption.label : placeholder"
        @input="handleFilterInput"
        @click.stop
      />
      <span
        v-else
        :class="[ns.e('value'), ns.is('placeholder', !selectedOption)]"
      >
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
    </div>

    <span :class="ns.e('suffix')">
      <button
        v-if="showClear"
        :class="ns.e('clear')"
        type="button"
        tabindex="-1"
        aria-label="清空"
        @click.stop="clear"
      >
        <BiliIcon name="close-circle" />
      </button>
      <BiliIcon :class="ns.e('arrow')" name="chevron-down" />
    </span>
  </div>

  <Teleport to="body">
    <Transition name="bili-select-dropdown">
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        :class="ns.e('panel')"
        :style="panelStyles"
        role="listbox"
      >
        <div ref="listRef" :class="ns.e('list')">
          <button
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            :data-index="index"
            :class="[
              ns.e('option'),
              ns.is('selected', option.value === modelValue),
              ns.is('active', index === activeIndex),
              ns.is('disabled', option.disabled)
            ]"
            type="button"
            role="option"
            :aria-selected="option.value === modelValue"
            :disabled="option.disabled"
            @mouseenter="activeIndex = index"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </button>
          <div v-if="!filteredOptions.length" :class="ns.e('empty')">
            {{ emptyText }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
