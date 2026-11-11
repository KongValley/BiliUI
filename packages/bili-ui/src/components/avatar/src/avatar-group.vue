<script setup lang="ts">
import { computed, provide, ref, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { avatarGroupProps, avatarGroupKey } from './avatar-group'

defineOptions({ name: 'BiliAvatarGroup' })

const props = defineProps(avatarGroupProps)
const ns = useNamespace('avatar-group')

const order = ref<symbol[]>([])
const size = computed(() => props.size)
const shape = computed(() => props.shape)
const max = computed(() => props.max)

const register = (id: symbol) => {
  order.value = [...order.value, id]
}

const unregister = (id: symbol) => {
  order.value = order.value.filter(item => item !== id)
}

provide(avatarGroupKey, {
  size,
  shape,
  max,
  order,
  register,
  unregister
})

const restCount = computed(() =>
  props.max > 0 ? Math.max(0, order.value.length - props.max) : 0
)

const SIZE_MAP = { sm: 24, md: 32, lg: 40 } as const
const restSize = computed(() => {
  if (typeof props.size === 'number') return props.size
  return SIZE_MAP[(props.size ?? 'md') as keyof typeof SIZE_MAP] ?? 32
})

const restStyle = computed<CSSProperties>(() => ({
  width: `${restSize.value}px`,
  height: `${restSize.value}px`,
  fontSize: `${Math.max(10, Math.round(restSize.value * 0.36))}px`,
  borderRadius: (props.shape ?? 'circle') === 'circle' ? '50%' : undefined
}))

const rootStyle = computed<CSSProperties>(() => ({
  [ns.cssVar('spacing')]: addUnit(props.spacing)
}) as CSSProperties)
</script>

<template>
  <div :class="[ns.b(), ns.m(props.shape ?? 'circle')]" :style="rootStyle">
    <slot />

    <span v-if="restCount > 0" :class="ns.e('rest')" :style="restStyle">
      +{{ restCount }}
    </span>
  </div>
</template>
