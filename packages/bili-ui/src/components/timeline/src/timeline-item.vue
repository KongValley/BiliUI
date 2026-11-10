<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { timelineItemProps } from './timeline'

defineOptions({ name: 'BiliTimelineItem' })

const props = defineProps(timelineItemProps)
const ns = useNamespace('timeline-item')

const dotStyle = computed<CSSProperties | undefined>(() =>
  props.color
    ? ({ '--bili-timeline-dot-color': props.color } as CSSProperties)
    : undefined
)
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.is(`type-${props.type}`, true),
      ns.is('hollow', props.hollow),
      ns.is('icon', !!props.icon)
    ]"
    role="listitem"
  >
    <div :class="ns.e('tail')">
      <span :class="ns.e('dot')" :style="dotStyle">
        <slot name="dot">
          <BiliIcon v-if="props.icon" :class="ns.e('icon')" :name="props.icon" />
        </slot>
      </span>
      <span :class="ns.e('line')" aria-hidden="true" />
    </div>

    <div :class="ns.e('content')">
      <div v-if="props.timestamp || $slots.timestamp" :class="ns.e('timestamp')">
        <slot name="timestamp">{{ props.timestamp }}</slot>
      </div>
      <div :class="ns.e('body')">
        <slot />
      </div>
    </div>
  </div>
</template>
