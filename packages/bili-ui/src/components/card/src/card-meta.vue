<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import { cardMetaProps } from './card-meta'

defineOptions({ name: 'BiliCardMeta' })

defineProps(cardMetaProps)
const ns = useNamespace('card-meta')
</script>

<template>
  <div :class="ns.b()">
    <div v-if="avatar || $slots.avatar" :class="ns.e('avatar')">
      <slot name="avatar">
        <img :src="avatar" :alt="title" />
      </slot>
    </div>

    <div :class="ns.e('detail')">
      <div v-if="title || $slots.title" :class="ns.e('title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.description" :class="ns.e('description')">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>
