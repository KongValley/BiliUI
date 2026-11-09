<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { cardProps } from './card'

defineOptions({ name: 'BiliCard' })

const props = defineProps(cardProps)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const ns = useNamespace('card')
const rootRef = ref<HTMLElement | null>(null)

const rootClasses = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.m(`shadow-${props.shadow}`),
  ns.is('bordered', props.bordered),
  ns.is('hoverable', props.hoverable),
  ns.is('loading', props.loading)
])

const headerVisible = computed(
  () => !!props.title || !!props.extra
)

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}

defineExpose({ rootRef })
</script>

<template>
  <div ref="rootRef" :class="rootClasses" @click="handleClick">
    <div v-if="$slots.cover" :class="ns.e('cover')">
      <slot name="cover" />
    </div>

    <div v-if="headerVisible || $slots.header || $slots.extra" :class="ns.e('header')">
      <div :class="ns.e('title')">
        <slot name="header">{{ title }}</slot>
      </div>
      <div v-if="extra || $slots.extra" :class="ns.e('extra')">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>

    <div :class="[ns.e('body'), ns.is('flush', bodyFlush)]">
      <slot />
    </div>

    <div v-if="$slots.footer" :class="ns.e('footer')">
      <slot name="footer" />
    </div>

    <div v-if="loading" :class="ns.e('loading')" role="status" aria-live="polite">
      <BiliIcon :class="ns.e('spinner')" name="loading" spin />
      <span :class="ns.e('loading-text')">
        <slot name="loading">加载中...</slot>
      </span>
    </div>
  </div>
</template>
