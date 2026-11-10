<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useSlots,
  watch,
  type CSSProperties
} from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useZIndex } from '../../../hooks/use-z-index'
import { addUnit } from '../../../utils/dom'
import BiliIcon from '../../icon/src/icon.vue'
import { menuProps, type MenuItem } from './menu'
import { menuContextKey, type MenuContext } from './context'
import MenuItemNode from './menu-item.vue'
import SubMenuNode from './sub-menu.vue'
import MenuPanelProvider from './panel-provider.vue'

defineOptions({ name: 'BiliMenu' })

const props = defineProps(menuProps)

const locale = useLocale()
const displayEllipsisText = computed(() => props.ellipsisText || locale.value.more)

const emit = defineEmits<{
  'update:modelValue': [key: string]
  select: [key: string, item: MenuItem]
  'update:collapsed': [collapsed: boolean]
  'open-change': [keys: string[]]
}>()

const ns = useNamespace('menu')
const slots = useSlots()
const { nextZIndex, currentZIndex } = useZIndex()

const rootRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const moreTriggerRef = ref<HTMLElement | null>(null)
const morePanelRef = ref<HTMLElement | null>(null)

const openedKeys = ref<string[]>([...props.defaultOpenedKeys])
const moreVisible = ref(false)
const overflowCount = ref(0)

const isHorizontal = computed(() => props.mode === 'horizontal')
const isCollapsed = computed(() => props.mode === 'vertical' && props.collapsed)
const useOverflow = computed(() => isHorizontal.value && props.overflow && !props.collapsed)

// ---------------------------------------------------------------------------
// Selection and sub menu state
// ---------------------------------------------------------------------------

const selectedKey = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value as string)
})

const isOpen = (key: string) => openedKeys.value.includes(key)

const toggleOpen = (key: string, open?: boolean) => {
  const shouldOpen = open ?? !isOpen(key)
  if (shouldOpen === isOpen(key) && open !== undefined) return
  const next = shouldOpen
    ? [...openedKeys.value.filter(item => item !== key), key]
    : openedKeys.value.filter(item => item !== key)
  openedKeys.value = next
  emit('open-change', next)
}

const closeFloating = () => {
  moreVisible.value = false
}

const select = (key: string, label: string) => {
  selectedKey.value = key
  emit('select', key, { key, label })
  if (isHorizontal.value || isCollapsed.value) closeFloating()
}

const context: MenuContext = {
  mode: computed(() => props.mode),
  triggerValue: computed(() => props.trigger),
  collapsed: isCollapsed,
  selectedKey,
  popperClass: computed(() => props.popperClass),
  isOpen,
  toggleOpen,
  select,
  inPanel: false,
  depth: 0
}

provide(menuContextKey, context)

// ---------------------------------------------------------------------------
// Horizontal overflow collection
// ---------------------------------------------------------------------------

const { floatingStyles: moreFloatingStyles, isPositioned: morePositioned } = useFloating(
  moreTriggerRef,
  morePanelRef,
  { placement: 'bottom-end', offset: 4 }
)

const moreStyles = computed<CSSProperties>(() => ({
  ...moreFloatingStyles.value,
  zIndex: currentZIndex.value,
  visibility: morePositioned.value ? 'visible' : 'hidden'
}))

const visibleItems = computed(() => {
  if (!useOverflow.value || overflowCount.value === 0) return props.items
  return props.items.slice(0, Math.max(0, props.items.length - overflowCount.value))
})

const overflowItems = computed(() => {
  if (!useOverflow.value || overflowCount.value === 0) return []
  return props.items.slice(Math.max(0, props.items.length - overflowCount.value))
})

/**
 * Decides how many trailing items must move into the "more" dropdown.
 *
 * Item widths are cached outside the reactive graph because collapsed items are
 * removed from the visible list and can no longer be measured. Re-measuring only
 * the visible prefix on every resize would oscillate: shrinking removes items,
 * which then look like they fit again.
 */
let cachedWidths: number[] = []

const computeOverflow = () => {
  const list = listRef.value
  const container = rootRef.value
  if (!list || !container) return

  const available = container.clientWidth
  if (!available) return

  const rendered = Array.from(list.children) as HTMLElement[]

  // Only rebuild the cache when every item is rendered; otherwise the visible
  // prefix would overwrite the cached widths of the trailing items.
  if (rendered.length === props.items.length) {
    const widths = rendered.map(el => el.offsetWidth)
    const changed =
      widths.length !== cachedWidths.length ||
      widths.some((width, index) => width !== cachedWidths[index])
    if (changed) cachedWidths = widths
  }

  const widths = cachedWidths
  if (widths.length !== props.items.length) return
  if (widths.some(width => !width)) return

  const moreButtonAllowance = 76
  let used = 0
  let fitting = widths.length

  for (let index = 0; index < widths.length; index += 1) {
    // The last item never needs room reserved for the "more" button.
    const budget = index === widths.length - 1 ? available : available - moreButtonAllowance
    if (used + widths[index] > budget) {
      fitting = index
      break
    }
    used += widths[index]
  }

  const nextCount = Math.max(0, widths.length - fitting)
  // Always keep at least one item in the bar.
  const safeCount = Math.min(nextCount, Math.max(0, widths.length - 1))
  if (safeCount !== overflowCount.value) overflowCount.value = safeCount
}

const measureOverflow = () => {
  if (!useOverflow.value) {
    overflowCount.value = 0
    return
  }
  // Drop cached widths and remeasure from the full list.
  cachedWidths = []
  overflowCount.value = 0
  nextTick(() => {
    computeOverflow()
  })
}

const openMore = () => {
  if (!overflowItems.value.length) return
  nextZIndex()
  moreVisible.value = true
}

const toggleMore = () => {
  if (moreVisible.value) closeFloating()
  else openMore()
}

useClickOutside([moreTriggerRef, morePanelRef], () => closeFloating())

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

let observer: ResizeObserver | null = null

onMounted(() => {
  measureOverflow()
  if (typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(() => computeOverflow())
  if (rootRef.value) observer.observe(rootRef.value)
  if (listRef.value) observer.observe(listRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

watch(
  () => props.items,
  () => {
    cachedWidths = []
    nextTick(measureOverflow)
  },
  { deep: true }
)

watch(useOverflow, enabled => {
  overflowCount.value = 0
  if (enabled) nextTick(measureOverflow)
})

const rootStyle = computed<CSSProperties>(() => ({
  width: isCollapsed.value ? addUnit(props.collapsedWidth) : undefined
}))

const hasItems = computed(() => props.items.length > 0)
const hasSlot = computed(() => !!slots.default)

defineExpose({ measureOverflow, toggleOpen, openedKeys, overflowCount })
</script>

<template>
  <nav
    ref="rootRef"
    :class="[ns.b(), ns.m(mode), ns.is('collapsed', isCollapsed), ns.is('overflow', useOverflow)]"
    :style="rootStyle"
    role="navigation"
  >
    <ul v-if="hasItems" ref="listRef" :class="[ns.e('list'), ns.e(`list-${mode}`)]" role="menubar">
      <template v-for="item in visibleItems" :key="item.key">
        <SubMenuNode
          v-if="item.children?.length"
          :sub-key="item.key"
          :title="item.label"
          :icon="item.icon"
          :disabled="item.disabled"
        >
          <MenuItemNode
            v-for="child in item.children"
            :key="child.key"
            :item-key="child.key"
            :label="child.label"
            :icon="child.icon"
            :disabled="child.disabled"
          />
        </SubMenuNode>
        <MenuItemNode
          v-else
          :item-key="item.key"
          :label="item.label"
          :icon="item.icon"
          :disabled="item.disabled"
        />
      </template>
    </ul>

    <ul
      v-else-if="hasSlot"
      ref="listRef"
      :class="[ns.e('list'), ns.e(`list-${mode}`)]"
      role="menubar"
    >
      <slot />
    </ul>

    <button
      v-if="useOverflow && overflowItems.length"
      ref="moreTriggerRef"
      :class="[ns.e('more'), ns.is('open', moreVisible)]"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="moreVisible"
      @click="toggleMore"
    >
      <span>{{ displayEllipsisText }}</span>
      <BiliIcon :class="ns.e('more-arrow')" name="chevron-down" />
    </button>

    <Teleport to="body">
      <Transition :name="ns.transition('menu-popup')">
        <ul
          v-if="moreVisible"
          ref="morePanelRef"
          :class="[ns.e('panel'), ns.e('list'), popperClass]"
          :style="moreStyles"
          role="menu"
        >
          <MenuPanelProvider :parent="context">
            <template v-for="item in overflowItems" :key="item.key">
              <SubMenuNode
                v-if="item.children?.length"
                :sub-key="item.key"
                :title="item.label"
                :icon="item.icon"
                :disabled="item.disabled"
              >
                <MenuItemNode
                  v-for="child in item.children"
                  :key="child.key"
                  :item-key="child.key"
                  :label="child.label"
                  :icon="child.icon"
                  :disabled="child.disabled"
                />
              </SubMenuNode>
              <MenuItemNode
                v-else
                :item-key="item.key"
                :label="item.label"
                :icon="item.icon"
                :disabled="item.disabled"
              />
            </template>
          </MenuPanelProvider>
        </ul>
      </Transition>
    </Teleport>
  </nav>
</template>
