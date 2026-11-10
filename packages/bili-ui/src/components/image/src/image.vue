<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import BiliIcon from '../../icon/src/icon.vue'
import ImageViewer from './image-viewer.vue'
import { imageProps } from './image'

defineOptions({ name: 'BiliImage' })

const props = defineProps(imageProps)

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
  show: []
  close: []
  switch: [index: number]
}>()

const ns = useNamespace('image')

const loaded = ref(false)
const hasError = ref(false)
const showViewer = ref(false)
const previewIndex = ref(props.initialIndex)

const hasPreview = computed(() => props.previewSrcList.length > 0)

const wrapperStyle = computed(() => ({
  width: addUnit(props.width) || undefined,
  height: addUnit(props.height) || undefined
}))

const imageStyle = computed(() => ({ objectFit: props.fit }))

watch(
  () => props.src,
  () => {
    loaded.value = false
    hasError.value = false
  }
)

const handleLoad = (event: Event) => {
  loaded.value = true
  hasError.value = false
  emit('load', event)
}

const handleError = (event: Event) => {
  hasError.value = true
  loaded.value = false
  emit('error', event)
}

const clampIndex = (index: number) =>
  Math.min(Math.max(index, 0), Math.max(0, props.previewSrcList.length - 1))

const showPreview = (index = props.initialIndex) => {
  if (!hasPreview.value) return
  previewIndex.value = clampIndex(index)
  if (!showViewer.value) {
    showViewer.value = true
    emit('show')
  }
}

const closePreview = () => {
  if (!showViewer.value) return
  showViewer.value = false
  emit('close')
}

const handleViewerVisibility = (visible: boolean) => {
  if (visible) showPreview()
  else closePreview()
}

defineExpose({ showPreview, closePreview })
</script>

<template>
  <div
    :class="[ns.b(), ns.is('loaded', loaded && !hasError), ns.is('error', hasError)]"
    :style="wrapperStyle"
  >
    <img
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      :loading="lazy ? 'lazy' : undefined"
      :class="ns.e('inner')"
      :style="imageStyle"
      draggable="false"
      @load="handleLoad"
      @error="handleError"
    />

    <div v-if="!loaded && !hasError" :class="ns.e('placeholder')">
      <slot name="placeholder">
        <BiliIcon :class="ns.e('placeholder-icon')" name="image" />
      </slot>
    </div>

    <div v-if="hasError" :class="ns.e('error')">
      <slot name="error">图片加载失败</slot>
    </div>

    <button
      v-if="hasPreview"
      type="button"
      :class="ns.e('preview-mask')"
      aria-label="预览图片"
      @click="showPreview()"
    >
      <BiliIcon name="eye" />
      <span>预览</span>
    </button>

    <ImageViewer
      :visible="showViewer"
      :url-list="previewSrcList"
      :initial-index="previewIndex"
      :alt="alt"
      :teleported="previewTeleported"
      :hide-on-click-modal="hideOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :z-index="zIndex"
      :preview-class="previewClass"
      :min-scale="minScale"
      :max-scale="maxScale"
      :zoom-rate="zoomRate"
      @update:visible="handleViewerVisibility"
      @close="closePreview"
      @switch="emit('switch', $event)"
    />
  </div>
</template>
