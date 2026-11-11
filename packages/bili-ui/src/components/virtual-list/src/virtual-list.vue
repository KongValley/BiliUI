<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { virtualListProps } from './virtual-list'

defineOptions({ name: 'BiliVirtualList' })

const props = defineProps(virtualListProps)

const emit = defineEmits<{
  scroll: [scrollTop: number]
}>()

const ns = useNamespace('virtual-list')
const scrollerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)

const totalHeight = computed(() => props.data.length * props.itemHeight)
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
)
const endIndex = computed(() =>
  Math.min(
    props.data.length,
    Math.ceil((scrollTop.value + props.height) / props.itemHeight) + props.buffer
  )
)
const offsetY = computed(() => startIndex.value * props.itemHeight)
const visibleItems = computed(() => props.data.slice(startIndex.value, endIndex.value))
const bottomHeight = computed(() =>
  Math.max(0, totalHeight.value - endIndex.value * props.itemHeight)
)

const itemKey = (item: any, index: number): string | number => {
  if (typeof props.rowKey === 'function') return props.rowKey(item, startIndex.value + index)
  if (typeof props.rowKey === 'string' && item?.[props.rowKey] !== undefined) {
    return item[props.rowKey]
  }
  return startIndex.value + index
}

const handleScroll = () => {
  const top = scrollerRef.value?.scrollTop ?? 0
  scrollTop.value = top
  emit('scroll', top)
}

const scrollToIndex = (index: number) => {
  const top = Math.max(0, Math.min(index, props.data.length - 1)) * props.itemHeight
  scrollTop.value = top
  if (scrollerRef.value) scrollerRef.value.scrollTop = top
  emit('scroll', top)
}

const scrollTo = (top: number) => {
  const next = Math.max(0, Math.min(top, totalHeight.value))
  scrollTop.value = next
  if (scrollerRef.value) scrollerRef.value.scrollTop = next
  emit('scroll', next)
}

watch(
  () => props.data.length,
  () => {
    if (scrollTop.value > totalHeight.value) scrollTo(totalHeight.value)
  }
)

defineExpose({
  scrollToIndex,
  scrollTo,
  getScrollTop: () => scrollTop.value,
  scroller: scrollerRef
})
</script>

<template>
  <div
    ref="scrollerRef"
    :class="ns.b()"
    :style="{ height: `${height}px` }"
    @scroll.passive="handleScroll"
  >
    <div :class="ns.e('phantom')" :style="{ height: `${totalHeight}px` }">
      <div :style="{ height: `${offsetY}px` }" aria-hidden="true" />

      <div
        v-for="(item, index) in visibleItems"
        :key="itemKey(item, index)"
        :class="ns.e('item')"
        :style="{ height: `${itemHeight}px` }"
      >
        <slot :item="item" :index="startIndex + index">{{ item }}</slot>
      </div>

      <div :style="{ height: `${bottomHeight}px` }" aria-hidden="true" />
    </div>
  </div>
</template>
