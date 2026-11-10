<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue'
import qrcode from 'qrcode-generator'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { qrcodeProps, type QRCodeErrorLevel } from './qrcode'

defineOptions({ name: 'BiliQRCode' })

const props = defineProps(qrcodeProps)

const emit = defineEmits<{
  error: [error: Error]
}>()

const ns = useNamespace('qrcode')
const locale = useLocale()

const matrix = ref<boolean[][] | null>(null)
const invalid = ref(false)

const encode = () => {
  invalid.value = false
  if (!props.value) {
    matrix.value = null
    return
  }

  try {
    const qr = qrcode(0, props.errorLevel as QRCodeErrorLevel)
    qr.addData(props.value)
    qr.make()
    const count = qr.getModuleCount()
    const rows: boolean[][] = []
    for (let row = 0; row < count; row += 1) {
      const cells: boolean[] = []
      for (let col = 0; col < count; col += 1) cells.push(qr.isDark(row, col))
      rows.push(cells)
    }
    matrix.value = rows
  } catch (error) {
    matrix.value = null
    invalid.value = true
    emit('error', error instanceof Error ? error : new Error(String(error)))
  }
}

watch(() => [props.value, props.errorLevel], encode, { immediate: true })

const moduleCount = computed(() => matrix.value?.length ?? 0)
const totalModules = computed(() => moduleCount.value + props.margin * 2)
const viewBox = computed(() => `0 0 ${totalModules.value} ${totalModules.value}`)

const path = computed(() => {
  if (!matrix.value) return ''
  const offset = props.margin
  const parts: string[] = []
  matrix.value.forEach((row, rowIndex) => {
    row.forEach((dark, colIndex) => {
      if (!dark) return
      parts.push(`M${colIndex + offset} ${rowIndex + offset}h1v1h-1z`)
    })
  })
  return parts.join('')
})

const iconBox = computed(() => {
  if (!props.icon || !totalModules.value) return 0
  const ratio = Math.min(1, Math.max(0.1, props.iconSize / Math.max(1, props.size)))
  return ratio * totalModules.value
})

const iconPosition = computed(() => (totalModules.value - iconBox.value) / 2)

const wrapperStyle = computed<CSSProperties>(() => ({
  [ns.cssVar('size')]: `${props.size}px`
}))

const emptyText = computed(() => (invalid.value ? locale.value.invalid : locale.value.empty))
const displayAriaLabel = computed(() => props.ariaLabel || locale.value.qrcode)
</script>

<template>
  <div :class="ns.b()" :style="wrapperStyle">
    <svg
      v-if="matrix"
      :class="ns.e('svg')"
      :viewBox="viewBox"
      :width="size"
      :height="size"
      role="img"
      :aria-label="displayAriaLabel"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect :width="totalModules" :height="totalModules" :fill="background" />
      <path :d="path" :fill="color" />
      <template v-if="icon">
        <rect
          :x="iconPosition"
          :y="iconPosition"
          :width="iconBox"
          :height="iconBox"
          rx="2"
          :fill="background"
        />
        <image
          :href="icon"
          :x="iconPosition"
          :y="iconPosition"
          :width="iconBox"
          :height="iconBox"
          preserveAspectRatio="xMidYMid meet"
        />
      </template>
    </svg>
    <div v-else :class="ns.e('empty')">
      <span>{{ emptyText }}</span>
    </div>
  </div>
</template>
