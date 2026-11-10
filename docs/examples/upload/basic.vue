<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile } from 'bili-ui'

const files = ref<UploadFile[]>([])
const pictureFiles = ref<UploadFile[]>([])
const lastEvent = ref('')

const handleSuccess = (file: UploadFile) => {
  lastEvent.value = `${file.name} 上传成功`
}

const handleError = (file: UploadFile, error: string) => {
  lastEvent.value = `${file.name} 上传失败：${error}`
}

/** Simulates a backend that fails for files named "fail.txt". */
const mockRequest = async ({
  file,
  onProgress
}: {
  file: File
  onProgress: (percent: number) => void
}) => {
  for (let percent = 20; percent <= 100; percent += 40) {
    await new Promise(resolve => setTimeout(resolve, 150))
    onProgress(percent)
  }
  if (file.name.includes('fail')) throw new Error('服务端拒绝')
  return `/uploads/${encodeURIComponent(file.name)}`
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">点击上传</span>
      <BiliUpload
        v-model:file-list="files"
        :limit="3"
        multiple
        tip="最多上传 3 个文件，超过后会提示"
        :http-request="mockRequest"
        @success="handleSuccess"
        @error="handleError"
      />
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">拖拽上传 + 图片缩略图</span>
      <BiliUpload
        v-model:file-list="pictureFiles"
        drag
        multiple
        list-type="picture"
        accept="image/*"
        tip="支持拖拽图片到虚线区域"
        :http-request="mockRequest"
      />
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">手动上传（不自动开始）</span>
      <BiliUpload v-model:file-list="files" drag :auto-upload="false" tip="选中文件后进入 ready 状态" />
    </BiliSpace>

    <div class="result">
      <span class="label">最近事件：</span>
      <code>{{ lastEvent || '（暂无）' }}</code>
    </div>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.result {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  color: var(--bili-text-secondary);
}

code {
  padding: 1px 6px;
  color: var(--bili-text-primary);
  background: var(--bili-fill-color-light);
  border-radius: 4px;
}
</style>
