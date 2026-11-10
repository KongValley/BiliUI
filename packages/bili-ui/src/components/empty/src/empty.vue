<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import { emptyProps } from './empty'

defineOptions({ name: 'BiliEmpty' })

defineProps(emptyProps)

const ns = useNamespace('empty')
</script>

<template>
  <div :class="[ns.b(), ns.m(preset), ns.is('small', small)]" role="status">
    <div :class="ns.e('image')">
      <slot name="image">
        <svg
          v-if="preset === 'search'"
          class="bili-empty__svg"
          viewBox="0 0 120 90"
          aria-hidden="true"
        >
          <rect x="10" y="16" width="100" height="58" rx="8" fill="none" stroke="currentColor" />
          <path d="M10 30h100" stroke="currentColor" />
          <circle cx="20" cy="23" r="2.4" fill="currentColor" />
          <circle cx="28" cy="23" r="2.4" fill="currentColor" />
          <circle cx="54" cy="50" r="14" fill="none" stroke="currentColor" />
          <path d="m64 60 10 10" stroke="currentColor" stroke-linecap="round" />
        </svg>

        <svg
          v-else-if="preset === 'data'"
          class="bili-empty__svg"
          viewBox="0 0 120 90"
          aria-hidden="true"
        >
          <ellipse cx="60" cy="26" rx="34" ry="12" fill="none" stroke="currentColor" />
          <path d="M26 26v34c0 6.6 15.2 12 34 12s34-5.4 34-12V26" fill="none" stroke="currentColor" />
          <path
            d="M26 43c0 6.6 15.2 12 34 12s34-5.4 34-12"
            fill="none"
            stroke="currentColor"
            opacity="0.6"
          />
        </svg>

        <svg
          v-else-if="preset === 'simple'"
          class="bili-empty__svg"
          viewBox="0 0 120 90"
          aria-hidden="true"
        >
          <rect x="24" y="20" width="72" height="50" rx="6" fill="none" stroke="currentColor" />
          <path d="M40 38h40M40 50h28" stroke="currentColor" stroke-linecap="round" />
        </svg>

        <svg v-else class="bili-empty__svg" viewBox="0 0 120 90" aria-hidden="true">
          <path
            d="M25 60 38 26h44l13 34Z"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
          />
          <path d="M25 60h70" stroke="currentColor" stroke-linecap="round" />
          <path d="M46 44h28" stroke="currentColor" stroke-linecap="round" opacity="0.7" />
          <circle cx="60" cy="72" r="2" fill="currentColor" opacity="0.5" />
        </svg>
      </slot>
    </div>

    <div v-if="description || $slots.description" :class="ns.e('description')">
      <slot name="description">{{ description }}</slot>
    </div>

    <div v-if="$slots.default" :class="ns.e('footer')">
      <slot />
    </div>
  </div>
</template>
