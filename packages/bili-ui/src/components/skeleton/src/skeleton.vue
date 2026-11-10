<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import { skeletonProps } from './skeleton'
import BiliSkeletonItem from './skeleton-item.vue'

defineOptions({ name: 'BiliSkeleton' })

const props = defineProps(skeletonProps)

const ns = useNamespace('skeleton')

// The last body row is shortened so the placeholder reads like real text.
const rowWidth = (index: number): string => {
  if (!props.rows || props.rows <= 1) return '100%'
  return index === props.rows - 1 ? '72%' : '100%'
}
</script>

<template>
  <div v-if="loading" :class="[ns.b(), ns.is('animated', animated)]" aria-busy="true">
    <template v-if="$slots.template">
      <slot name="template" />
    </template>

    <template v-else>
      <div v-if="avatar" :class="ns.e('header')">
        <BiliSkeletonItem variant="circle" :size="48" />
        <div :class="ns.e('header-lines')">
          <BiliSkeletonItem variant="text" width="45%" height="16px" />
          <BiliSkeletonItem variant="text" width="30%" height="12px" />
        </div>
      </div>

      <div :class="ns.e('content')">
        <BiliSkeletonItem
          v-if="title"
          variant="text"
          :class="ns.e('title')"
          width="38%"
          height="18px"
        />
        <BiliSkeletonItem
          v-for="index in rows"
          :key="index"
          variant="text"
          :width="rowWidth(index - 1)"
        />
      </div>
    </template>
  </div>

  <slot v-else />
</template>
