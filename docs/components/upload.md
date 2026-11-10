---
title: Upload 上传
---

# Upload 上传

文件上传，支持点击选择、拖拽上传、进度展示、图片缩略图与自定义请求。

<script setup>
import DemoBasic from '../examples/upload/basic.vue'
import basicCode from '../examples/upload/basic.vue?raw'
</script>

## 基础用法

`http-request` 替换默认的模拟上传逻辑，接入真实接口即可。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `fileList` | 受控文件列表，配合 `v-model:file-list` | `UploadFile[]` | — |
| `multiple` | 是否允许多选 | `boolean` | `false` |
| `accept` | 接受的文件类型 | `string` | `''` |
| `limit` | 最大文件数 | `number` | `0`（不限） |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `drag` | 是否使用拖拽区域 | `boolean` | `false` |
| `autoUpload` | 选中后是否自动上传 | `boolean` | `true` |
| `httpRequest` | 自定义上传请求 | `(options) => Promise<string \| void>` | — |
| `beforeUpload` | 上传前拦截 | `(file: File) => boolean \| Promise<boolean>` | — |
| `listType` | 列表样式 | `'text' \| 'picture'` | `'text'` |
| `tip` | 提示文字 | `string` | `''` |

### UploadFile

```ts
interface UploadFile {
  uid: string
  name: string
  size: number
  type: string
  status: 'ready' | 'uploading' | 'success' | 'error'
  percent: number
  raw?: File
  url?: string
  error?: string
}
```

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:fileList` | 文件列表变化 | `(files: UploadFile[])` |
| `change` | 单个文件加入列表 | `(file, files)` |
| `success` | 单个文件上传成功 | `(file)` |
| `error` | 上传失败 | `(file, error)` |
| `remove` | 移除文件 | `(file)` |
| `exceed` | 超出数量限制 | `(files: File[])` |

## 说明

- 未提供 `httpRequest` 时使用内置的模拟上传，便于本地演示与测试。
- `httpRequest` 通过 `onProgress(percent)` 上报进度，返回的字符串作为文件 URL。
- 图片文件在 `listType="picture"` 下用 `URL.createObjectURL` 生成本地预览，组件卸载或移除时回收。
- `beforeUpload` 支持异步判断，返回 `false` 或抛出异常即取消该文件。
