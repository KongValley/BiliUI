<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useId } from '../../../hooks/use-id'
import { useZIndex } from '../../../hooks/use-z-index'
import BiliIcon from '../../icon/src/icon.vue'
import { colorPickerProps } from './color-picker'
import { hexToRgb, hsvToHex, normalizeHex, rgbToHsv } from './color'

defineOptions({ name: 'BiliColorPicker' })

const props = defineProps(colorPickerProps)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'visible-change': [visible: boolean]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const ns = useNamespace('color-picker')
const { nextZIndex, currentZIndex } = useZIndex()
const panelId = useId('bili-color-picker-panel')

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const svRef = ref<HTMLElement | null>(null)
const hueRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const hue = ref(0)
const saturation = ref(100)
const value = ref(100)

const { floatingStyles, isPositioned } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-start',
  offset: 6
})

const normalizedValue = computed(() => normalizeHex(props.modelValue))
const hasValue = computed(() => !!normalizedValue.value)
const currentHex = computed(() => hsvToHex({ h: hue.value, s: saturation.value, v: value.value }))
const displayHex = computed(() => normalizedValue.value ?? currentHex.value)

const hexInput = ref(displayHex.value.toUpperCase())

const panelStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  zIndex: currentZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const svStyles = computed<CSSProperties>(() => ({
  backgroundColor: `hsl(${hue.value} 100% 50%)`
}))

const markerStyles = computed<CSSProperties>(() => ({
  left: `${saturation.value}%`,
  top: `${100 - value.value}%`,
  backgroundColor: currentHex.value
}))

const hueMarkerStyles = computed<CSSProperties>(() => ({
  left: `${(hue.value / 360) * 100}%`
}))

const syncFromHex = (hex: string, emitChange = false) => {
  const normalized = normalizeHex(hex)
  if (!normalized) return
  const { r, g, b } = hexToRgb(normalized)
  const hsv = rgbToHsv(r, g, b)
  hue.value = hsv.h
  saturation.value = hsv.s
  value.value = hsv.v
  if (emitChange) {
    emit('update:modelValue', normalized)
    emit('change', normalized)
  }
}

watch(
  () => props.modelValue,
  next => {
    const normalized = normalizeHex(next)
    if (!normalized || normalized === currentHex.value) return
    syncFromHex(normalized)
  },
  { immediate: true }
)

watch(currentHex, next => {
  hexInput.value = next.toUpperCase()
})

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  nextZIndex()
  emit('visible-change', true)
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  emit('visible-change', false)
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const emitCurrent = () => {
  const hex = currentHex.value
  hexInput.value = hex.toUpperCase()
  emit('update:modelValue', hex)
  emit('change', hex)
}

const clamp = (input: number, min: number, max: number) => Math.min(max, Math.max(min, input))

let dragType: 'sv' | 'hue' | null = null

const updateFromPointer = (event: PointerEvent) => {
  if (dragType === 'sv' && svRef.value) {
    const rect = svRef.value.getBoundingClientRect()
    saturation.value = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100)
    value.value = clamp(100 - ((event.clientY - rect.top) / rect.height) * 100, 0, 100)
    emitCurrent()
  } else if (dragType === 'hue' && hueRef.value) {
    const rect = hueRef.value.getBoundingClientRect()
    hue.value = clamp(((event.clientX - rect.left) / rect.width) * 360, 0, 360)
    emitCurrent()
  }
}

const handlePointerMove = (event: PointerEvent) => {
  if (!dragType) return
  event.preventDefault()
  updateFromPointer(event)
}

const stopDrag = () => {
  dragType = null
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', stopDrag)
}

const startDrag = (event: PointerEvent, type: 'sv' | 'hue') => {
  if (props.disabled) return
  event.preventDefault()
  dragType = type
  updateFromPointer(event)
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', stopDrag)
}

const setHex = (input: string) => {
  syncFromHex(input, true)
}

const commitHexInput = () => {
  const normalized = normalizeHex(hexInput.value)
  if (!normalized) {
    hexInput.value = displayHex.value.toUpperCase()
    return
  }
  hexInput.value = normalized.toUpperCase()
  if (normalized !== normalizedValue.value) setHex(normalized)
}

const handleHexInput = (event: Event) => {
  hexInput.value = (event.target as HTMLInputElement).value
}

const clear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  close()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    close()
  } else if ((event.key === 'Enter' || event.key === ' ') && !isOpen.value) {
    event.preventDefault()
    open()
  }
}

watch(
  () => props.disabled,
  disabled => {
    if (disabled) close()
  }
)

useClickOutside([triggerRef, panelRef], () => close())
onBeforeUnmount(stopDrag)

defineExpose({ open, close, focus: () => triggerRef.value?.focus() })
</script>

<template>
  <div
    ref="triggerRef"
    :class="[ns.b(), ns.m(size), ns.is('open', isOpen), ns.is('disabled', disabled)]"
    role="button"
    aria-haspopup="dialog"
    :aria-expanded="isOpen"
    :aria-controls="panelId"
    :tabindex="disabled ? -1 : 0"
    @click="toggle"
    @keydown="handleKeydown"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <span v-if="hasValue" :class="ns.e('swatch')" :style="{ backgroundColor: displayHex }" />
    <span :class="[ns.e('value'), ns.is('placeholder', !hasValue)]">
      {{ hasValue ? displayHex.toUpperCase() : placeholder }}
    </span>

    <span :class="ns.e('suffix')">
      <button
        v-if="clearable && hasValue && !disabled"
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
    <Transition name="bili-color-picker-dropdown">
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        :class="[ns.e('panel'), popperClass]"
        :style="panelStyles"
        role="dialog"
        :aria-label="placeholder"
      >
        <div
          ref="svRef"
          :class="ns.e('sv')"
          :style="svStyles"
          @pointerdown="startDrag($event, 'sv')"
        >
          <div :class="ns.e('sv-white')" />
          <div :class="ns.e('sv-black')" />
          <span :class="ns.e('sv-marker')" :style="markerStyles" />
        </div>

        <div ref="hueRef" :class="ns.e('hue')" @pointerdown="startDrag($event, 'hue')">
          <span :class="ns.e('hue-marker')" :style="hueMarkerStyles" />
        </div>

        <div :class="ns.e('footer')">
          <span :class="ns.e('preview')" :style="{ backgroundColor: displayHex }" />
          <input
            :class="ns.e('hex')"
            :value="hexInput"
            type="text"
            aria-label="颜色值"
            spellcheck="false"
            @input="handleHexInput"
            @blur="commitHexInput"
            @keydown.enter.prevent="commitHexInput"
          />
        </div>

        <div v-if="presets.length" :class="ns.e('presets')">
          <button
            v-for="preset in presets"
            :key="preset"
            :class="ns.e('preset')"
            type="button"
            :style="{ backgroundColor: preset }"
            :aria-label="preset"
            @click="setHex(preset)"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
