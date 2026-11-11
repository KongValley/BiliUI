<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig, useLocale } from '../../../hooks/use-config'
import BiliEmpty from '../../empty/src/empty.vue'
import BiliLoading from '../../loading/src/loading.vue'
import { listProps } from './list'

defineOptions({ name: 'BiliList' })

const props = defineProps(listProps)

const ns = useNamespace('list')
const config = useConfig()
const locale = useLocale()

const mergedSize = computed(() => props.size ?? config.value.size)
const displayEmpty = computed(() => props.emptyText || locale.value.empty)

const itemKey = (item: any, index: number): string | number => {
  if (typeof props.rowKey === 'function') return props.rowKey(item, index)
  if (typeof props.rowKey === 'string' && item?.[props.rowKey] !== undefined) {
    return item[props.rowKey]
  }
  return index
}
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(mergedSize),
      ns.is('bordered', bordered),
      ns.is('split', split),
      ns.is('hoverable', hoverable),
      ns.is('loading', loading)
    ]"
  >
    <div v-if="header || $slots.header" :class="ns.e('header')">
      <slot name="header">{{ header }}</slot>
    </div>

    <div :class="ns.e('body')" role="list">
      <div
        v-for="(item, index) in data"
        :key="itemKey(item, index)"
        :class="ns.e('item')"
        role="listitem"
      >
        <slot :item="item" :index="index">{{ item }}</slot>
      </div>

      <div v-if="!data.length && !loading" :class="ns.e('empty')">
        <slot name="empty">
          <BiliEmpty small :description="displayEmpty" />
        </slot>
      </div>

      <div v-if="loading" :class="ns.e('loading')">
        <slot name="loading">
          <BiliLoading :text="locale.loading" />
        </slot>
      </div>
    </div>

    <div v-if="footer || $slots.footer" :class="ns.e('footer')">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>
