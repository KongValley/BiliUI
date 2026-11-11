<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig, useLocale } from '../../../hooks/use-config'
import { useFocusTrap } from '../../../hooks/use-focus-trap'
import { useScrollLock } from '../../../hooks/use-scroll-lock'
import { useZIndex } from '../../../hooks/use-z-index'
import { useEventListener } from '../../../hooks/use-event-listener'
import { isTopOverlay, pushOverlay, removeOverlay } from '../../../hooks/use-overlay-stack'
import BiliIcon from '../../icon/src/icon.vue'
import BiliButton from '../../button/src/button.vue'
import {
  messageBoxProps,
  type MessageBoxAction,
  type MessageBoxController,
  type MessageBoxType
} from './message-box'

defineOptions({ name: 'BiliMessageBox' })

const props = defineProps(messageBoxProps)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  action: [action: MessageBoxAction, value: string]
  input: [value: string]
  opened: []
  closed: []
}>()

const ns = useNamespace('message-box')
const locale = useLocale()
const config = useConfig()
const { nextZIndex } = useZIndex()
const token = Symbol('bili-message-box')

const panelRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const mounted = ref(props.modelValue)
const visible = ref(props.modelValue)
const zIndex = ref(props.zIndex ?? 2000)
const value = ref(props.inputValue)
const error = ref('')
const loading = ref(false)
let settled = false
let closing = false

const typeIcons: Record<MessageBoxType, string> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
}

const displayTitle = computed(() => props.title)
const displayConfirmText = computed(() => props.confirmText || locale.value.confirm)
const displayCancelText = computed(() => props.cancelText || locale.value.cancel)
const displayPlaceholder = computed(
  () => props.inputPlaceholder || locale.value.promptPlaceholder
)

useScrollLock(computed(() => props.modelValue))
useFocusTrap(panelRef, computed(() => visible.value))

const focusTarget = () => {
  void nextTick(() => {
    if (props.input) inputRef.value?.focus()
    else panelRef.value?.focus()
  })
}

watch(
  () => props.modelValue,
  next => {
    if (next) {
      mounted.value = true
      visible.value = true
      settled = false
      closing = false
      loading.value = false
      error.value = ''
      value.value = props.inputValue
      zIndex.value = props.zIndex ?? nextZIndex()
      pushOverlay(token)
      focusTarget()
    } else if (mounted.value) {
      visible.value = false
    }
  },
  { immediate: true }
)

watch(
  () => props.inputValue,
  next => {
    if (!props.input) return
    value.value = next
  }
)

const validateInput = (): boolean => {
  if (!props.input) return true
  const text = value.value

  if (props.inputPattern && !props.inputPattern.test(text)) {
    error.value = locale.value.invalid
    return false
  }

  const result = props.inputValidator?.(text)
  if (result === false) {
    error.value = locale.value.invalid
    return false
  }
  if (typeof result === 'string') {
    error.value = result
    return false
  }

  error.value = ''
  return true
}

const finish = (action: MessageBoxAction) => {
  if (settled) return
  settled = true
  emit('update:modelValue', false)
  emit('action', action, value.value)
}

const controller: MessageBoxController = {
  confirm: () => requestAction('confirm'),
  cancel: () => requestAction('cancel'),
  close: () => requestAction('close'),
  setLoading: next => {
    loading.value = next
  }
}

const runBeforeClose = (action: MessageBoxAction) => {
  const done = () => finish(action)
  if (!props.beforeClose) {
    done()
    return
  }

  const result = props.beforeClose(action, controller, done)
  if (result && typeof (result as Promise<unknown>).then === 'function') {
    loading.value = true
    ;(result as Promise<unknown>)
      .then(() => {
        loading.value = false
        done()
      })
      .catch(() => {
        loading.value = false
      })
  }
}

const requestAction = (action: MessageBoxAction) => {
  if (closing) return
  if (action === 'confirm' && !validateInput()) return

  closing = true
  runBeforeClose(action)
}

const handleModalClick = () => {
  if (props.closeOnClickModal) requestAction('close')
}

const handleInput = (event: Event) => {
  value.value = (event.target as HTMLInputElement).value
  error.value = ''
  emit('input', value.value)
}

const onAfterEnter = () => emit('opened')

const onAfterLeave = () => {
  removeOverlay(token)
  if (!props.modelValue) mounted.value = false
  emit('closed')
}

useEventListener(
  () => (typeof document !== 'undefined' ? document : undefined),
  'keydown',
  (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !visible.value || !props.closeOnPressEscape) return
    if (!isTopOverlay(token)) return
    event.stopPropagation()
    requestAction('close')
  }
)

onBeforeUnmount(() => removeOverlay(token))

defineExpose({
  confirm: controller.confirm,
  cancel: controller.cancel,
  close: controller.close,
  setLoading: controller.setLoading
})
</script>

<template>
  <Teleport to="body">
    <Transition
      :name="ns.transition('message-box')"
      appear
      @after-enter="onAfterEnter"
      @after-leave="onAfterLeave"
    >
      <div
        v-if="mounted"
        v-show="visible"
        :class="[ns.e('overlay'), overlayClass]"
        :style="{ zIndex }"
        @click.self="handleModalClick"
      >
        <div
          ref="panelRef"
          :class="[ns.b(), ns.m(type), panelClass]"
          role="alertdialog"
          aria-modal="true"
          :aria-label="displayTitle || locale.messageBox"
          tabindex="-1"
        >
          <header v-if="displayTitle || showClose" :class="ns.e('header')">
            <div :class="ns.e('title')">
              <slot name="title">{{ displayTitle }}</slot>
            </div>
            <button
              v-if="showClose"
              :class="ns.e('close')"
              type="button"
              :aria-label="locale.close"
              @click="requestAction('close')"
            >
              <BiliIcon name="close" />
            </button>
          </header>

          <div :class="ns.e('body')">
            <span :class="ns.e('icon')" aria-hidden="true">
              <BiliIcon :name="typeIcons[type]" />
            </span>

            <div :class="ns.e('content')">
              <div :class="ns.e('message')">
                <slot>{{ message }}</slot>
              </div>

              <p v-if="error" :class="ns.e('error')" role="alert">{{ error }}</p>

              <input
                v-if="input"
                ref="inputRef"
                :class="ns.e('input')"
                :value="value"
                :placeholder="displayPlaceholder"
                :aria-invalid="!!error"
                @input="handleInput"
                @keydown.enter.prevent="requestAction('confirm')"
              />
            </div>
          </div>

          <footer :class="ns.e('footer')">
            <BiliButton
              v-if="showCancelButton"
              :size="config.size"
              :disabled="loading"
              @click="requestAction('cancel')"
            >
              {{ displayCancelText }}
            </BiliButton>
            <BiliButton
              type="primary"
              :size="config.size"
              :loading="loading"
              @click="requestAction('confirm')"
            >
              {{ displayConfirmText }}
            </BiliButton>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
