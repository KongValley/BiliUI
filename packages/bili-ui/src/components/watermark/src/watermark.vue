<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { watermarkProps } from './watermark'
import {
  defaultWatermarkFont,
  loadWatermarkImage,
  normalizePair,
  renderWatermark
} from './watermark-render'

defineOptions({ name: 'BiliWatermark' })

const props = defineProps(watermarkProps)

const ns = useNamespace('watermark')

const backgroundImage = ref('')
let token = 0

const gap = computed(() => normalizePair(props.gap))
const offset = computed(() => normalizePair(props.offset))

const lines = computed(() => {
  if (props.image) return []
  const list = Array.isArray(props.content) ? props.content : [props.content]
  return list.map(line => String(line)).filter(line => line.length > 0)
})

const font = computed(() => ({ ...defaultWatermarkFont, ...props.font }))

const generate = async () => {
  const current = ++token
  let image: HTMLImageElement | null = null

  if (props.image) {
    try {
      image = await loadWatermarkImage(props.image)
    } catch {
      image = null
    }
    if (current !== token) return
  }

  const url = renderWatermark({
    content: lines.value,
    image,
    imageOpacity: props.imageOpacity,
    font: font.value,
    width: props.width,
    height: props.height,
    rotate: props.rotate,
    gapX: gap.value[0],
    gapY: gap.value[1]
  })

  if (current !== token) return
  backgroundImage.value = url ? `url("${url}")` : ''
}

watch(
  [
    () => props.content,
    () => props.image,
    () => props.imageOpacity,
    () => props.font,
    () => props.width,
    () => props.height,
    () => props.rotate,
    () => props.gap,
    () => props.offset
  ],
  generate,
  { immediate: true, deep: true }
)

const overlayStyle = computed<CSSProperties>(() => {
  if (!backgroundImage.value) return {}
  return {
    '--bili-watermark-image': backgroundImage.value,
    '--bili-watermark-size': `${props.width + gap.value[0]}px ${props.height + gap.value[1]}px`,
    '--bili-watermark-position': `${offset.value[0]}px ${offset.value[1]}px`,
    '--bili-watermark-z-index': String(props.zIndex)
  }
})

defineExpose({ update: generate })
</script>

<template>
  <div :class="ns.b()">
    <slot />
    <div
      :class="[ns.e('overlay'), ns.is('empty', !backgroundImage)]"
      :style="overlayStyle"
      aria-hidden="true"
    />
  </div>
</template>
