<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { tabPaneProps } from './tabs'
import { useTabsContext } from './context'

defineOptions({ name: 'BiliTabPane' })

const props = defineProps(tabPaneProps)

const ns = useNamespace('tab-pane')
const tabs = useTabsContext()

const el = ref<HTMLElement | null>(null)

const isActive = computed(() => tabs.activeName.value === props.name)

// `lazy` keeps unvisited panels unmounted; `visited` is owned by the parent.
const shouldRender = computed(() => !tabs.lazy.value || tabs.visited.value.has(props.name))

onMounted(() => {
  tabs.register({
    name: props.name,
    label: props.label,
    icon: props.icon,
    disabled: props.disabled,
    closable: props.closable,
    el: el.value
  })
})

watch(
  () => [props.label, props.disabled, props.closable, props.icon],
  () => {
    tabs.register({
      name: props.name,
      label: props.label,
      icon: props.icon,
      disabled: props.disabled,
      closable: props.closable,
      el: el.value
    })
  }
)

// Vue removes the component only after unmount, so unregister on teardown.
onBeforeUnmount(() => tabs.unregister(props.name))
</script>

<template>
  <div
    v-if="shouldRender"
    v-show="isActive"
    :id="`${tabs.id.value}-panel-${name}`"
    ref="el"
    :class="[ns.b(), ns.is('active', isActive)]"
    role="tabpanel"
    :aria-hidden="!isActive"
  >
    <slot />
  </div>
</template>
