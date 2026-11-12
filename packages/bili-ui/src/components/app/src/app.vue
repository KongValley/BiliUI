<script setup lang="ts">
import { onBeforeUnmount, provide } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig } from '../../../hooks/use-config'
import { createMessageApi } from '../../message'
import { createNotificationApi } from '../../notification'
import { createMessageBoxApi } from '../../message-box'
import { appProps } from './app'
import { appContextKey, type AppContext } from './use-app'

defineOptions({ name: 'BiliApp' })

const props = defineProps(appProps)

const ns = useNamespace('app')
const config = useConfig()
const owner = Symbol('bili-app')

// Each bound API reads `config` at call time, so runtime locale/namespace
// changes are picked up without recreating the services.
const services: AppContext = {
  config,
  message: createMessageApi({
    getContext: () => ({ config: config.value, owner }),
    defaults: () => props.message
  }),
  notification: createNotificationApi({
    getContext: () => ({ config: config.value, owner }),
    defaults: () => props.notification
  }),
  messageBox: createMessageBoxApi({
    getContext: () => ({ config: config.value, owner })
  })
}

provide(appContextKey, services)

// Do not leave scoped overlays behind when the App subtree is torn down.
onBeforeUnmount(() => {
  services.message.closeAll()
  services.notification.closeAll()
  services.messageBox.closeAll()
})

defineExpose({
  message: services.message,
  notification: services.notification,
  messageBox: services.messageBox
})
</script>

<template>
  <component :is="component" :class="ns.b()">
    <slot />
  </component>
</template>
