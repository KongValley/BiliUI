<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import BiliButton from '../../button/src/button.vue'
import BiliPopover from './popover.vue'
import { popconfirmProps } from './popover'

defineOptions({ name: 'BiliPopconfirm' })

const props = defineProps(popconfirmProps)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const ns = useNamespace('popconfirm')
const locale = useLocale()
const confirmLabel = computed(() => props.confirmText || locale.value.confirm)
const cancelLabel = computed(() => props.cancelText || locale.value.cancel)

const popoverRef = ref<InstanceType<typeof BiliPopover> | null>(null)
const loading = ref(false)

const close = () => popoverRef.value?.close()

const handleConfirm = async () => {
  emit('confirm')
  if (!props.onConfirm) {
    close()
    return
  }

  try {
    loading.value = true
    await props.onConfirm()
    close()
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
  close()
}

defineExpose({ close })
</script>

<template>
  <BiliPopover
    ref="popoverRef"
    :visible="visible"
    :placement="placement"
    :trigger="trigger"
    :width="width"
    :disabled="disabled"
    :offset="offset"
    :show-arrow="showArrow"
    :close-on-click-outside="closeOnClickOutside"
    :popper-class="popperClass"
  >
    <template #reference>
      <slot />
    </template>

    <template #content>
      <div :class="ns.b()">
        <div :class="ns.e('body')">
          <slot name="content">{{ content }}</slot>
        </div>

        <div :class="ns.e('actions')">
          <slot name="actions">
            <BiliButton size="sm" :loading="loading" @click="handleCancel">
              {{ cancelLabel }}
            </BiliButton>
            <BiliButton size="sm" :type="confirmType" :loading="loading" @click="handleConfirm">
              {{ confirmLabel }}
            </BiliButton>
          </slot>
        </div>
      </div>
    </template>
  </BiliPopover>
</template>
