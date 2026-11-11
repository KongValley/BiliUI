<script setup lang="ts">
import { computed, inject, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { addUnit } from '../../../utils/dom'
import BiliIcon from '../../icon/src/icon.vue'
import {
  floatButtonGroupKey,
  floatButtonProps,
  type FloatButtonShape
} from './float-button'

defineOptions({ name: 'BiliFloatButton' })

const props = defineProps(floatButtonProps)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const ns = useNamespace('float-button')
const locale = useLocale()
const group = inject(floatButtonGroupKey, null)

const inGroup = computed(() => !!group?.inGroup.value)
const shape = computed<FloatButtonShape>(() => props.shape)

const iconName = computed(() => props.icon || (props.backTop ? 'chevron-up' : 'plus'))
const sizeMap: Record<string, string> = { sm: '32px', md: '40px', lg: '48px' }
const size = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : (sizeMap[props.size] ?? props.size)
)

const rootStyle = computed<CSSProperties>(() => {
  if (inGroup.value) return {}
  return {
    [ns.cssVar('right')]: addUnit(props.right),
    [ns.cssVar('bottom')]: addUnit(props.bottom),
    [ns.cssVar('z-index')]: String(props.zIndex),
    [ns.cssVar('size')]: size.value
  } as CSSProperties
})

const hasDescription = computed(() => !!props.description)

const scrollToTop = () => {
  if (typeof window === 'undefined') return
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch {
    window.scrollTo(0, 0)
  }
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
  if (props.backTop) scrollToTop()
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :class="[
      ns.b(),
      ns.m(type),
      ns.m(shape),
      ns.is('with-description', hasDescription),
      ns.is('in-group', inGroup),
      ns.is('disabled', disabled)
    ]"
    :style="rootStyle"
    :href="disabled ? undefined : href || undefined"
    :target="target || undefined"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :type="href ? undefined : 'button'"
    :disabled="href ? undefined : disabled"
    :aria-label="description || icon || locale.floatButton"
    @click="handleClick"
  >
    <span :class="ns.e('icon')">
      <slot name="icon">
        <slot>
          <BiliIcon :name="iconName" />
        </slot>
      </slot>
    </span>

    <span v-if="hasDescription || $slots.description" :class="ns.e('description')">
      <slot name="description">{{ description }}</slot>
    </span>
  </component>
</template>
