<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { collapseItemProps } from './collapse'
import { useCollapseContext } from './context'

defineOptions({ name: 'BiliCollapseItem' })

const props = defineProps(collapseItemProps)

const emit = defineEmits<{
  change: [open: boolean]
}>()

const ns = useNamespace('collapse-item')
const collapse = useCollapseContext()

const open = computed(() => collapse.isOpen(props.name))

const headerRef = ref<HTMLElement | null>(null)

const handleClick = () => {
  if (props.disabled) return
  collapse.toggle(props.name)
  emit('change', !open.value)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  handleClick()
}
</script>

<template>
  <div :class="[ns.b(), ns.is('open', open), ns.is('disabled', disabled)]">
    <div
      ref="headerRef"
      :class="[ns.e('header'), ns.is('borderless', hideBorder)]"
      role="button"
      tabindex="0"
      :aria-expanded="open"
      :aria-disabled="disabled"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <div :class="ns.e('title')">
        <BiliIcon v-if="icon" :class="ns.e('icon')" :name="icon" />
        <slot name="title">{{ title }}</slot>
      </div>

      <BiliIcon :class="ns.e('arrow')" name="chevron-down" :size="14" />
    </div>

    <div v-show="open" :class="ns.e('wrapper')" role="region">
      <div :class="ns.e('body')">
        <slot />
      </div>
    </div>
  </div>
</template>
