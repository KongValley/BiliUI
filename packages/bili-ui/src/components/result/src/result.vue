<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { resultProps } from './result'

defineOptions({ name: 'BiliResult' })

const props = defineProps(resultProps)

const ns = useNamespace('result')

const isCodeStatus = computed(() => ['403', '404', '500'].includes(props.status))

const tone = computed(() => {
  switch (props.status) {
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'error':
    case '500':
      return 'danger'
    default:
      return 'primary'
  }
})
</script>

<template>
  <div :class="[ns.b(), ns.m(status), ns.m(`tone-${tone}`)]" role="status">
    <div :class="ns.e('icon')">
      <slot name="icon">
        <span v-if="isCodeStatus" :class="ns.e('code')">{{ status }}</span>

        <svg v-else-if="status === 'success'" :class="ns.e('svg')" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="3" />
          <path
            d="M20 33.5 28.5 42 45 24"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg v-else-if="status === 'warning'" :class="ns.e('svg')" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="3" />
          <path d="M32 18v18" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
          <circle cx="32" cy="45" r="2.6" fill="currentColor" />
        </svg>

        <svg v-else-if="status === 'error'" :class="ns.e('svg')" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="3" />
          <path
            d="m24 24 16 16M40 24 24 40"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>

        <svg v-else :class="ns.e('svg')" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="3" />
          <path d="M32 30v16" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
          <circle cx="32" cy="21" r="2.6" fill="currentColor" />
        </svg>
      </slot>
    </div>

    <div v-if="title || $slots.title" :class="ns.e('title')">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="subTitle || $slots.subTitle" :class="ns.e('subtitle')">
      <slot name="subTitle">{{ subTitle }}</slot>
    </div>

    <div v-if="$slots.default" :class="ns.e('extra')">
      <slot />
    </div>
  </div>
</template>
