import type { PropType } from 'vue'

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadFile {
  uid: string
  name: string
  size: number
  type: string
  status: UploadStatus
  /** 0–100 while uploading. */
  percent: number
  raw?: File
  url?: string
  error?: string
}

export interface UploadRequestOptions {
  file: File
  onProgress: (percent: number) => void
}

export const uploadProps = {
  /** Controlled file list. Omit for an internally managed list. */
  fileList: {
    type: Array as PropType<UploadFile[]>,
    default: undefined
  },
  /** Allow selecting several files at once. */
  multiple: Boolean,
  accept: {
    type: String,
    default: ''
  },
  /** Maximum number of files; further selections are rejected. */
  limit: {
    type: Number,
    default: 0
  },
  disabled: Boolean,
  /** Show a drop zone instead of a button. */
  drag: Boolean,
  /** Auto-upload as soon as files are selected. */
  autoUpload: {
    type: Boolean,
    default: true
  },
  /** Replaces the built-in simulated uploader with a real request. */
  httpRequest: {
    type: Function as PropType<(options: UploadRequestOptions) => Promise<string | void>>,
    default: undefined
  },
  /** Return false (or reject) to cancel a file before uploading. */
  beforeUpload: {
    type: Function as PropType<(file: File) => boolean | Promise<boolean>>,
    default: undefined
  },
  /** Renders image thumbnails for image files. */
  listType: {
    type: String as PropType<'text' | 'picture'>,
    default: 'text'
  },
  tip: {
    type: String,
    default: ''
  }
} as const

export type UploadProps = typeof uploadProps
