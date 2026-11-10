<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { skeletonItemProps } from './skeleton'

defineOptions({ name: 'BiliSkeletonItem' })

const props = defineProps(skeletonItemProps)

const ns = useNamespace('skeleton-item')

const style = computed<CSSProperties>(() => {
  const result: CSSProperties = {}
  const width = addUnit(props.width)
  const height = addUnit(props.height)
  const size = addUnit(props.size)

  if (size) {
    result.width = size
    result.height = size
  } else {
    if (width) result.width = width
    if (height) result.height = height
  }

  return result
})
</script>

<template>
  <span :class="[ns.b(), ns.m(variant)]" :style="style" aria-hidden="true" />
</template>
