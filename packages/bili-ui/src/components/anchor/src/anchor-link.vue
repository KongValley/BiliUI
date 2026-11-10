<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { anchorContextKey, anchorLinkKey, anchorLinkProps } from './anchor'

defineOptions({ name: 'BiliAnchorLink' })

const props = defineProps(anchorLinkProps)

const ns = useNamespace('anchor')
const anchor = inject(anchorContextKey, null)
const parent = inject(anchorLinkKey, null)

provide(anchorLinkKey, {
  get href() {
    return props.href
  }
})

const isActive = computed(() => anchor?.isActive(props.href) ?? false)
const isExactActive = computed(() => anchor?.isExactActive(props.href) ?? false)
const showMarker = computed(() => anchor?.marker.value ?? true)

const getTarget = () => {
  if (typeof document === 'undefined') return null
  return document.getElementById(props.href.replace(/^#/, ''))
}

const register = () => {
  anchor?.registerLink({
    href: props.href,
    parent: parent?.href ?? '',
    getEl: getTarget
  })
}

const handleClick = (event: MouseEvent) => {
  anchor?.handleClick(event, props.href)
}

onMounted(register)

watch(
  () => props.href,
  (href, previous) => {
    if (!previous || !anchor) return
    anchor.unregisterLink(previous)
    anchor.registerLink({ href, parent: parent?.href ?? '', getEl: getTarget })
  }
)

onBeforeUnmount(() => anchor?.unregisterLink(props.href))
</script>

<template>
  <div :class="ns.e('link-item')" role="listitem">
    <a
      :href="href"
      :class="[ns.e('link'), ns.is('active', isActive), ns.is('exact-active', isExactActive)]"
      :aria-current="isExactActive ? 'location' : undefined"
      @click="handleClick"
    >
      <span
        v-if="showMarker"
        :class="[ns.e('marker'), ns.is('visible', isExactActive)]"
        aria-hidden="true"
      />
      <span :class="ns.e('link-title')">
        <slot>{{ title }}</slot>
      </span>
    </a>

    <div v-if="$slots['sub-link']" :class="ns.e('sub-link')">
      <slot name="sub-link" />
    </div>
  </div>
</template>
