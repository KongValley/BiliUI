<script setup lang="ts">
import { computed, ref, useSlots, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import BiliIcon from '../../icon/src/icon.vue'
import { avatarProps } from './avatar'

defineOptions({ name: 'BiliAvatar' })

const props = defineProps(avatarProps)

const emit = defineEmits<{
  error: [event: Event]
}>()

const ns = useNamespace('avatar')
const slots = useSlots()

const SIZE_MAP = { sm: 24, md: 32, lg: 40 } as const

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  }
)

const showImage = computed(() => !!props.src && !failed.value)
const hasCustomFallback = computed(() => !!slots.default)
const showText = computed(() => !showImage.value && !props.icon && !hasCustomFallback.value)

/** Stable hue per name so the same person always gets the same colour. */
const hue = computed(() => {
  const source = props.name || props.alt
  let hash = 0
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) % 360
  }
  return hash
})

const initials = computed(() => {
  const name = props.name.trim()
  if (!name) return ''

  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length > 1) {
    return parts
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
  }

  if (name.length <= 2) return name

  // CJK names read better with the given name (last two characters).
  const isAscii = Array.from(name).every(char => char.charCodeAt(0) <= 0x7f)
  return isAscii ? name.slice(0, 2).toUpperCase() : name.slice(-2)
})

const sizePx = computed(() => {
  if (typeof props.size === 'number') return props.size
  return SIZE_MAP[props.size as keyof typeof SIZE_MAP]
})

const rootStyle = computed(() => {
  const style: Record<string, string> = { '--bili-avatar-hue': String(hue.value) }

  if (sizePx.value !== undefined) {
    style.width = `${sizePx.value}px`
    style.height = `${sizePx.value}px`
    style.fontSize = `${Math.max(10, Math.round(sizePx.value * 0.42))}px`
  } else {
    const cssSize = addUnit(props.size)
    if (cssSize) {
      style.width = cssSize
      style.height = cssSize
    }
  }

  return style as CSSProperties
})

const handleError = (event: Event) => {
  failed.value = true
  emit('error', event)
}
</script>

<template>
  <span
    :class="[
      ns.b(),
      ns.m(shape),
      ns.is('text', showText),
      ns.is('bordered', bordered)
    ]"
    :style="rootStyle"
    :title="name || alt || undefined"
    role="img"
    :aria-label="alt || name || '头像'"
  >
    <img
      v-if="showImage"
      :src="src"
      :alt="alt || name"
      :style="{ objectFit: fit }"
      @error="handleError"
    />
    <slot v-else>
      <BiliIcon v-if="icon" :class="ns.e('icon')" :name="icon" />
      <span v-else :class="ns.e('text')">{{ initials || '?' }}</span>
    </slot>
  </span>
</template>
