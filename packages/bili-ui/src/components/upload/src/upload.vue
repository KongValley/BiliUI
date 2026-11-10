<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { useId } from '../../../hooks/use-id'
import BiliIcon from '../../icon/src/icon.vue'
import BiliProgress from '../../progress/src/progress.vue'
import { uploadProps, type UploadFile } from './upload'

defineOptions({ name: 'BiliUpload' })

const props = defineProps(uploadProps)

const emit = defineEmits<{
  'update:fileList': [files: UploadFile[]]
  change: [file: UploadFile, files: UploadFile[]]
  success: [file: UploadFile]
  error: [file: UploadFile, error: string]
  remove: [file: UploadFile]
  exceed: [files: File[]]
}>()

const ns = useNamespace('upload')
const locale = useLocale()
const inputId = useId('bili-upload')
const inputRef = ref<HTMLInputElement | null>(null)
const innerFiles = ref<UploadFile[]>([])
const dragOver = ref(false)
let seed = 0

const files = computed(() => props.fileList ?? innerFiles.value)

const sync = (next: UploadFile[]) => {
  innerFiles.value = next
  emit('update:fileList', next)
}

const patchFile = (uid: string, patch: Partial<UploadFile>) => {
  const next = files.value.map(file => (file.uid === uid ? { ...file, ...patch } : file))
  sync(next)
}

const isImage = (file: UploadFile) => file.type.startsWith('image/')

/** Default uploader: simulates progress so the demo works without a backend. */
const defaultRequest = async (
  file: UploadFile,
  onProgress: (percent: number) => void
): Promise<void> => {
  for (let percent = 10; percent <= 100; percent += 30) {
    await new Promise(resolve => setTimeout(resolve, 120))
    onProgress(Math.min(percent, 100))
  }
}

const uploadFile = async (file: UploadFile) => {
  patchFile(file.uid, { status: 'uploading', percent: 0 })

  const onProgress = (percent: number) => patchFile(file.uid, { percent })

  try {
    let url: string | void = undefined
    if (props.httpRequest) {
      url = await props.httpRequest({ file: file.raw as File, onProgress })
    } else {
      await defaultRequest(file, onProgress)
    }
    patchFile(file.uid, { status: 'success', percent: 100, url: url || undefined })
    emit('success', { ...file, status: 'success', percent: 100 })
  } catch (error) {
    const message = error instanceof Error ? error.message : locale.value.uploadFailed
    patchFile(file.uid, { status: 'error', error: message })
    emit('error', { ...file, status: 'error', error: message }, message)
  }
}

const addFiles = async (rawFiles: File[]) => {
  if (props.disabled || !rawFiles.length) return

  const remaining = props.limit > 0 ? props.limit - files.value.length : Infinity
  if (rawFiles.length > remaining) {
    emit('exceed', rawFiles.slice(Math.max(0, remaining)))
    if (remaining <= 0) return
  }

  const accepted: UploadFile[] = []

  for (const raw of rawFiles.slice(0, remaining)) {
    if (props.beforeUpload) {
      const allowed = await props.beforeUpload(raw)
      if (!allowed) continue
    }

    const file: UploadFile = {
      uid: `upload-${seed++}`,
      name: raw.name,
      size: raw.size,
      type: raw.type,
      status: 'ready',
      percent: 0,
      raw,
      url: isImage({ type: raw.type } as UploadFile) ? URL.createObjectURL(raw) : undefined
    }

    accepted.push(file)
    sync([...files.value, file])
    emit('change', file, files.value)
  }

  if (props.autoUpload) {
    await Promise.all(accepted.map(file => uploadFile(file)))
  }
}

const handleInputChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const list = Array.from(target.files ?? [])
  await addFiles(list)
  target.value = ''
}

const openPicker = () => {
  if (props.disabled) return
  inputRef.value?.click()
}

const handleDrop = async (event: DragEvent) => {
  dragOver.value = false
  if (props.disabled) return
  const list = Array.from(event.dataTransfer?.files ?? [])
  await addFiles(list)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!props.disabled) dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}

const removeFile = (file: UploadFile) => {
  if (props.disabled) return
  if (file.url?.startsWith('blob:')) URL.revokeObjectURL(file.url)
  sync(files.value.filter(item => item.uid !== file.uid))
  emit('remove', file)
}

const retry = (file: UploadFile) => {
  if (props.disabled || !file.raw) return
  void uploadFile(file)
}

const formatSize = (size: number): string => {
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${size} B`
}
</script>

<template>
  <div :class="[ns.b(), ns.is('disabled', disabled)]">
    <input
      :id="inputId"
      ref="inputRef"
      :class="ns.e('input')"
      type="file"
      :accept="accept || undefined"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleInputChange"
    />

    <div
      v-if="drag"
      :class="[ns.e('dragger'), ns.is('dragover', dragOver)]"
      role="button"
      tabindex="0"
      @click="openPicker"
      @keydown.enter="openPicker"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <BiliIcon :class="ns.e('upload-icon')" name="upload" :size="28" />
      <p :class="ns.e('drag-text')">{{ locale.uploadDrag }}</p>
      <p v-if="tip" :class="ns.e('tip')">{{ tip }}</p>
    </div>

    <BiliButton v-else :disabled="disabled" icon="upload" @click="openPicker">
      <slot>{{ locale.selectFile }}</slot>
    </BiliButton>

    <p v-if="tip && !drag" :class="ns.e('tip')">{{ tip }}</p>

    <ul v-if="files.length" :class="[ns.e('list'), ns.m(`list-${listType}`)]">
      <li v-for="file in files" :key="file.uid" :class="ns.e('item')">
        <div
          v-if="listType === 'picture' && file.url && isImage(file)"
          :class="ns.e('thumb')"
        >
          <img :src="file.url" :alt="file.name" />
        </div>
        <BiliIcon v-else :class="ns.e('file-icon')" :name="'file-text'" :size="18" />

        <div :class="ns.e('info')">
          <div :class="ns.e('name')" :title="file.name">{{ file.name }}</div>
          <div :class="ns.e('meta')">
            <span :class="ns.e('size')">{{ formatSize(file.size) }}</span>
            <span v-if="file.status === 'error'" :class="ns.e('error')">{{ file.error }}</span>
          </div>
          <BiliProgress
            v-if="file.status === 'uploading'"
            :class="ns.e('progress')"
            :percentage="file.percent"
            :stroke-width="4"
            :show-text="false"
          />
        </div>

        <div :class="ns.e('actions')">
          <button
            v-if="file.status === 'error'"
            :class="ns.e('action')"
            type="button"
            :aria-label="locale.retry"
            @click="retry(file)"
          >
            <BiliIcon name="refresh" :size="14" />
          </button>
          <button
            :class="ns.e('action')"
            type="button"
            :aria-label="locale.remove"
            :disabled="disabled"
            @click="removeFile(file)"
          >
            <BiliIcon name="close" :size="14" />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
