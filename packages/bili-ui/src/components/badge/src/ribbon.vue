<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { ribbonProps } from './ribbon'

defineOptions({ name: 'BiliBadgeRibbon' })

const props = defineProps(ribbonProps)
const ns = useNamespace('badge-ribbon')

const ribbonStyle = computed<CSSProperties | undefined>(() =>
  props.color
    ? ({
        '--bili-badge-ribbon-bg': props.color,
        '--bili-badge-ribbon-notch': props.color
      } as CSSProperties)
    : undefined
)
</script>

<template>
  <div :class="ns.b()">
    <slot />

    <div :class="[ns.e('ribbon'), ns.m(placement)]" :style="ribbonStyle">
      <span :class="ns.e('text')">
        <slot name="text">{{ text }}</slot>
      </span>
    </div>
  </div>
</template>
