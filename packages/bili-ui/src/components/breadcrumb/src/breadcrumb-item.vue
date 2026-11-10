<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { breadcrumbItemProps } from './breadcrumb'
import { useBreadcrumbContext } from './context'

defineOptions({ name: 'BiliBreadcrumbItem' })

const props = defineProps(breadcrumbItemProps)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const ns = useNamespace('breadcrumb-item')
const breadcrumb = useBreadcrumbContext()

const key = Symbol('bili-breadcrumb-item')

const index = computed(() => breadcrumb.indexOf(key))
const total = computed(() => breadcrumb.items.value.length)
const isLast = computed(() => index.value === total.value - 1)

/**
 * Collapsing keeps the first and last entries visible and hides everything in
 * between, with an ellipsis rendered by the first hidden item.
 */
const collapsed = computed(() => {
  const max = breadcrumb.maxItems.value
  if (!max || total.value <= max || index.value < 0) {
    return { hidden: false, ellipsis: false }
  }
  const hidden = index.value > 0 && index.value < total.value - 1
  return { hidden, ellipsis: hidden && index.value === 1 }
})

const isLink = computed(() => !isLast.value && (!!props.to || !!props.href))

const handleClick = (event: MouseEvent) => {
  if (!isLink.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

onMounted(() => {
  breadcrumb.register({ key, to: props.to, href: props.href, replace: props.replace })
})

onBeforeUnmount(() => breadcrumb.unregister(key))
</script>

<template>
  <li
    v-show="!collapsed.hidden"
    :class="[ns.b(), ns.is('last', isLast)]"
  >
    <span v-if="collapsed.ellipsis" :class="ns.e('ellipsis')" aria-hidden="true">…</span>

    <span v-if="!isLast" :class="ns.e('separator')" aria-hidden="true">
      <slot name="separator">{{ breadcrumb.separator.value }}</slot>
    </span>

    <a
      v-if="isLink && href"
      :href="href"
      :class="ns.e('link')"
      @click="handleClick"
    >
      <slot />
    </a>
    <span
      v-else
      :class="[ns.e('link'), ns.is('current', isLast)]"
      :aria-current="isLast ? 'page' : undefined"
      @click="handleClick"
    >
      <slot />
    </span>
  </li>
</template>
