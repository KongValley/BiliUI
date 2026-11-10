<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { carouselContextKey, nextCarouselItemId } from './carousel'

defineOptions({ name: 'BiliCarouselItem' })

const ns = useNamespace('carousel-item')
const carousel = inject(carouselContextKey, null)

const uid = nextCarouselItemId()

const index = computed(() => (carousel ? carousel.items.indexOf(uid) : -1))
const isActive = computed(() => !!carousel && index.value === carousel.activeIndex.value)
const count = computed(() => carousel?.items.length ?? 0)

const itemStyle = computed(() => {
  const axis = carousel?.direction.value === 'vertical' ? 'Y' : 'X'
  let offset = '0%'
  if (carousel && !isActive.value) {
    offset = index.value < carousel.activeIndex.value ? '-100%' : '100%'
  }
  return {
    transform: `translate${axis}(${offset})`,
    opacity: isActive.value ? '1' : '0',
    zIndex: isActive.value ? '1' : '0'
  }
})

onMounted(() => carousel?.addItem(uid))
onBeforeUnmount(() => carousel?.removeItem(uid))
</script>

<template>
  <div
    :class="[ns.b(), ns.is('active', isActive)]"
    :style="itemStyle"
    role="group"
    aria-roledescription="slide"
    :aria-label="count ? `${index + 1} / ${count}` : undefined"
    :aria-hidden="!isActive || undefined"
  >
    <slot />
  </div>
</template>
