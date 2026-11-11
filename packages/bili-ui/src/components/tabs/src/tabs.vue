<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { useId } from '../../../hooks/use-id'
import BiliIcon from '../../icon/src/icon.vue'
import { tabsProps } from './tabs'
import { provideTabsContext, type TabPaneState, type TabsContext } from './context'

defineOptions({ name: 'BiliTabs' })

const props = defineProps(tabsProps)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'tab-click': [payload: { name: string | number; pane: TabPaneState }]
  'tab-change': [value: string | number]
  'tab-remove': [value: string | number]
  add: []
}>()

const ns = useNamespace('tabs')
const locale = useLocale()
const id = useId('bili-tabs')

const panes = ref<TabPaneState[]>([])
const visited = ref<Set<string | number>>(new Set())
const activeName = computed(() => props.modelValue)

const emitSelect = (pane: TabPaneState) => {
  if (pane.disabled) return
  select(pane.name)
  emit('tab-click', { name: pane.name, pane })
}

// ------------------------------------------------------------------ registry

const register = (pane: TabPaneState) => {
  const index = panes.value.findIndex(item => item.name === pane.name)
  if (index > -1) panes.value[index] = pane
  else panes.value.push(pane)

  if (pane.name === activeName.value) visited.value.add(pane.name)
  // Auto-select the first enabled tab when nothing is bound yet.
  if (activeName.value === undefined && !pane.disabled) {
    emit('update:modelValue', pane.name)
  }
  void nextTick(updateIndicator)
}

const unregister = (name: string | number) => {
  const index = panes.value.findIndex(item => item.name === name)
  if (index > -1) panes.value.splice(index, 1)
  void nextTick(updateIndicator)
}

const select = (name: string | number) => {
  const pane = panes.value.find(item => item.name === name)
  if (!pane || pane.disabled) return
  emit('update:modelValue', name)
}

const requestClose = (name: string | number) => {
  emit('tab-remove', name)
}

provideTabsContext({
  id: computed(() => id),
  activeName,
  type: computed(() => props.type),
  direction: computed(() => props.direction),
  lazy: computed(() => props.lazy),
  closable: computed(() => props.closable),
  register,
  unregister,
  select,
  requestClose,
  visited,
  panes
} as TabsContext)

// ------------------------------------------------------------------- indicator

const navRef = ref<HTMLElement | null>(null)
const indicator = ref({ x: 0, y: 0, width: 0, height: 0, visible: false })

const updateIndicator = () => {
  const nav = navRef.value
  if (!nav) return
  const active = nav.querySelector<HTMLElement>(`.${ns.e('tab')}.is-active`)
  if (!active) {
    indicator.value.visible = false
    return
  }
  indicator.value = {
    x: active.offsetLeft,
    y: active.offsetTop,
    width: active.offsetWidth,
    height: active.offsetHeight,
    visible: true
  }
}

watch(activeName, () => {
  if (activeName.value !== undefined) visited.value.add(activeName.value)
  void nextTick(updateIndicator)
})

watch(
  () => props.direction,
  () => void nextTick(updateIndicator)
)

let observer: ResizeObserver | null = null

onMounted(() => {
  void nextTick(updateIndicator)
  if (typeof ResizeObserver !== 'undefined' && navRef.value) {
    observer = new ResizeObserver(() => updateIndicator())
    observer.observe(navRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

// ----------------------------------------------------------------------- a11y

const handleKeydown = (event: KeyboardEvent) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
  if (!keys.includes(event.key)) return
  const enabled = panes.value.filter(pane => !pane.disabled)
  if (!enabled.length) return
  const current = enabled.findIndex(pane => pane.name === activeName.value)

  let next: number
  if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = enabled.length - 1
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = (current - 1 + enabled.length) % enabled.length
  } else {
    next = (current + 1) % enabled.length
  }

  event.preventDefault()
  select(enabled[next].name)
}

const indicatorStyle = computed(() => ({
  transform: `translate(${indicator.value.x}px, ${indicator.value.y}px)`,
  width: `${indicator.value.width}px`,
  height: props.direction === 'vertical' ? '0px' : '2px',
  opacity: indicator.value.visible ? 1 : 0
}))

const verticalBarStyle = computed(() => ({
  transform: `translate(${indicator.value.x}px, ${indicator.value.y}px)`,
  height: `${indicator.value.height}px`
}))

const showIndicator = computed(() => props.type === 'line' && indicator.value.visible)
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(type),
      direction === 'vertical' ? ns.m('vertical') : '',
      ns.is('stretch', stretch)
    ]"
  >
    <div
      ref="navRef"
      :class="ns.e('nav')"
      role="tablist"
      :aria-orientation="direction === 'vertical' ? 'vertical' : 'horizontal'"
    >
      <button
        v-for="pane in panes"
        :id="`${id}-tab-${pane.name}`"
        :key="pane.name"
        :class="[
          ns.e('tab'),
          ns.is('active', pane.name === activeName),
          ns.is('disabled', pane.disabled)
        ]"
        type="button"
        role="tab"
        :aria-selected="pane.name === activeName"
        :aria-controls="`${id}-panel-${pane.name}`"
        :tabindex="pane.name === activeName ? 0 : -1"
        :disabled="pane.disabled"
        @click="emitSelect(pane)"
        @keydown="handleKeydown"
      >
        <BiliIcon v-if="pane.icon" :class="ns.e('icon')" :name="pane.icon" />
        <span :class="ns.e('label')">{{ pane.label }}</span>
        <span
          v-if="closable && pane.closable"
          :class="ns.e('close')"
          role="button"
          :aria-label="locale.tabClose"
          @click.stop="requestClose(pane.name)"
        >
          <BiliIcon name="close" :size="12" />
        </span>
      </button>

      <span
        v-if="showIndicator && direction === 'horizontal'"
        :class="[ns.e('indicator'), ns.is('animated', animated)]"
        :style="indicatorStyle"
        aria-hidden="true"
      />
      <span
        v-if="showIndicator && direction === 'vertical'"
        :class="[ns.e('indicator'), ns.e('indicator-vertical'), ns.is('animated', animated)]"
        :style="verticalBarStyle"
        aria-hidden="true"
      />

      <button
        v-if="addable"
        :class="ns.e('add')"
        type="button"
        :aria-label="locale.tabAdd"
        @click="emit('add')"
      >
        <BiliIcon name="plus" :size="14" />
      </button>

      <div v-if="$slots.extra" :class="ns.e('extra')">
        <slot name="extra" />
      </div>
    </div>

    <div :class="ns.e('content')">
      <slot />
    </div>
  </div>
</template>
