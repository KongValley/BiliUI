import {
  computed,
  inject,
  shallowRef,
  type ComputedRef,
  type InjectionKey
} from 'vue'
import type { ComponentSize } from '../utils/types'

export interface BiliLocale {
  // common
  confirm: string
  cancel: string
  close: string
  clear: string
  empty: string
  invalid: string
  loading: string
  retry: string
  remove: string
  removeItem: string
  expand: string
  collapse: string
  selectAll: string
  search: string
  more: string
  // form controls
  selectPlaceholder: string
  searchPlaceholder: string
  clearInput: string
  inputTagPlaceholder: string
  showPassword: string
  hidePassword: string
  decrease: string
  increase: string
  colorPickerPlaceholder: string
  colorValue: string
  sliderLabel: string
  // pagination
  total: string
  pageSize: string
  pageSizeLabel: string
  prevPage: string
  nextPage: string
  jumpTo: string
  jumpToPage: string
  page: string
  // date / time
  selectDate: string
  startDate: string
  endDate: string
  rangeSeparator: string
  today: string
  last7Days: string
  thisMonth: string
  prevMonth: string
  nextMonth: string
  yearMonth: string
  yearLabel: string
  monthLabel: string
  weekdays: string[]
  clearDate: string
  selectTime: string
  hour: string
  minute: string
  second: string
  now: string
  clearTime: string
  // overlays / feedback
  prev: string
  next: string
  finish: string
  dialog: string
  drawer: string
  message: string
  messageBox: string
  promptPlaceholder: string
  notification: string
  notificationClose: string
  tourStep: string
  // table / tree / transfer
  sumText: string
  sortPriority: string
  resizeColumn: string
  selectRow: string
  transferTitles: [string, string]
  transferSelectAll: string
  moveToRight: string
  moveToLeft: string
  // upload
  uploadFailed: string
  uploadDrag: string
  selectFile: string
  // image / carousel
  imagePreview: string
  preview: string
  loadFailed: string
  previewImage: string
  closePreview: string
  prevImage: string
  nextImage: string
  zoomOut: string
  zoomIn: string
  actualSize: string
  rotateLeft: string
  rotateRight: string
  prevSlide: string
  nextSlide: string
  goToSlide: string
  // aria labels
  anchor: string
  breadcrumb: string
  avatar: string
  backTop: string
  floatButton: string
  scrollbar: string
  tabClose: string
  tabAdd: string
  progress: string
  slider: string
  qrcode: string
  copy: string
  copied: string
  copyCode: string
  edit: string
  // chart
  chartValue: string
  chartPercent: string
  chartTotal: string
  lineChart: string
  barChart: string
  pieChart: string
  gaugeChart: string
  radarChart: string
  scatterChart: string
  funnelChart: string
  // form validation
  validationFailed: string
  required: string
  email: string
  url: string
  array: string
  number: string
  min: string
  max: string
  len: string
  minLength: string
  maxLength: string
  pattern: string
}

export const zhCNLocale: BiliLocale = {
  confirm: '确定',
  cancel: '取消',
  close: '关闭',
  clear: '清空',
  empty: '暂无数据',
  invalid: '内容无法生成',
  loading: '加载中…',
  retry: '重试',
  remove: '移除',
  removeItem: '移除 {label}',
  expand: '展开',
  collapse: '收起',
  selectAll: '全选',
  search: '搜索',
  more: '更多',
  selectPlaceholder: '请选择',
  searchPlaceholder: '请输入关键字',
  clearInput: '清空',
  inputTagPlaceholder: '请输入后按回车',
  showPassword: '显示密码',
  hidePassword: '隐藏密码',
  decrease: '减少',
  increase: '增加',
  colorPickerPlaceholder: '请选择颜色',
  colorValue: '颜色值',
  sliderLabel: '滑块 {index}',
  total: '共 {total} 条',
  pageSize: '{size} 条/页',
  pageSizeLabel: '每页条数',
  prevPage: '上一页',
  nextPage: '下一页',
  jumpTo: '前往',
  jumpToPage: '跳转到页码',
  page: '页',
  selectDate: '请选择日期',
  startDate: '开始日期',
  endDate: '结束日期',
  rangeSeparator: '至',
  today: '今天',
  last7Days: '近 7 天',
  thisMonth: '本月',
  prevMonth: '上个月',
  nextMonth: '下个月',
  yearMonth: '{year} 年 {month} 月',
  yearLabel: '{year} 年',
  monthLabel: '{month} 月',
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  clearDate: '清空日期',
  selectTime: '请选择时间',
  hour: '时',
  minute: '分',
  second: '秒',
  now: '此刻',
  clearTime: '清空时间',
  prev: '上一步',
  next: '下一步',
  finish: '完成',
  dialog: '对话框',
  drawer: '抽屉',
  message: '消息',
  messageBox: '提示',
  promptPlaceholder: '请输入内容',
  notification: '通知',
  notificationClose: '关闭通知',
  tourStep: '第 {index} 步',
  sumText: '合计',
  sortPriority: '排序优先级 {priority}',
  resizeColumn: '调整{column}列宽',
  selectRow: '选择第 {index} 行',
  transferTitles: ['列表 1', '列表 2'],
  transferSelectAll: '全选{title}',
  moveToRight: '移到右侧',
  moveToLeft: '移到左侧',
  uploadFailed: '上传失败',
  uploadDrag: '点击或拖拽文件到此区域上传',
  selectFile: '选择文件',
  imagePreview: '图片预览',
  preview: '预览',
  loadFailed: '图片加载失败',
  previewImage: '预览图片',
  closePreview: '关闭预览',
  prevImage: '上一张',
  nextImage: '下一张',
  zoomOut: '缩小',
  zoomIn: '放大',
  actualSize: '实际大小',
  rotateLeft: '向左旋转',
  rotateRight: '向右旋转',
  prevSlide: '上一张',
  nextSlide: '下一张',
  goToSlide: '切换到第 {index} 张',
  anchor: '锚点导航',
  breadcrumb: '面包屑',
  avatar: '头像',
  backTop: '回到顶部',
  floatButton: '悬浮按钮',
  scrollbar: '滚动区域',
  tabClose: '关闭标签',
  tabAdd: '新建标签',
  progress: '进度 {percent}%',
  slider: '滑块 {index}',
  qrcode: '二维码',
  copy: '复制',
  copied: '已复制',
  copyCode: '复制代码',
  edit: '编辑',
  chartValue: '数值',
  chartPercent: '占比',
  chartTotal: '总计',
  lineChart: '折线图：{categories} 个分类，{series} 个系列',
  barChart: '柱状图：{categories} 个分类，{series} 个系列',
  pieChart: '饼图：{count} 个分类',
  gaugeChart: '仪表盘：{value}{unit} / {max}{unit}',
  radarChart: '雷达图：{count} 个指标',
  scatterChart: '散点图：{count} 个数据点',
  funnelChart: '漏斗图：{count} 个阶段',
  validationFailed: '校验未通过',
  required: '此项为必填项',
  email: '请输入正确的邮箱地址',
  url: '请输入正确的网址',
  array: '值必须为数组',
  number: '请输入数字',
  min: '不能小于 {min}',
  max: '不能大于 {max}',
  len: '长度应为 {len} 个字符',
  minLength: '最少 {min} 个字符',
  maxLength: '最多 {max} 个字符',
  pattern: '格式不正确'
}

export const enUSLocale: BiliLocale = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  close: 'Close',
  clear: 'Clear',
  empty: 'No data',
  invalid: 'Cannot generate content',
  loading: 'Loading…',
  retry: 'Retry',
  remove: 'Remove',
  removeItem: 'Remove {label}',
  expand: 'Expand',
  collapse: 'Collapse',
  selectAll: 'Select all',
  search: 'Search',
  more: 'More',
  selectPlaceholder: 'Select',
  searchPlaceholder: 'Search',
  clearInput: 'Clear',
  inputTagPlaceholder: 'Type and press Enter',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  decrease: 'Decrease',
  increase: 'Increase',
  colorPickerPlaceholder: 'Select color',
  colorValue: 'Color value',
  sliderLabel: 'Slider {index}',
  total: '{total} items',
  pageSize: '{size} / page',
  pageSizeLabel: 'Page size',
  prevPage: 'Previous page',
  nextPage: 'Next page',
  jumpTo: 'Go to',
  jumpToPage: 'Jump to page',
  page: 'page',
  selectDate: 'Select date',
  startDate: 'Start date',
  endDate: 'End date',
  rangeSeparator: 'to',
  today: 'Today',
  last7Days: 'Last 7 days',
  thisMonth: 'This month',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  yearMonth: '{month}/{year}',
  yearLabel: '{year}',
  monthLabel: '{month}',
  weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  clearDate: 'Clear date',
  selectTime: 'Select time',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  now: 'Now',
  clearTime: 'Clear time',
  prev: 'Previous',
  next: 'Next',
  finish: 'Finish',
  dialog: 'Dialog',
  drawer: 'Drawer',
  message: 'Messages',
  messageBox: 'Message',
  promptPlaceholder: 'Please enter',
  notification: 'Notifications',
  notificationClose: 'Close notification',
  tourStep: 'Step {index}',
  sumText: 'Total',
  sortPriority: 'Sort priority {priority}',
  resizeColumn: 'Resize {column} column',
  selectRow: 'Select row {index}',
  transferTitles: ['List 1', 'List 2'],
  transferSelectAll: 'Select all {title}',
  moveToRight: 'Move right',
  moveToLeft: 'Move left',
  uploadFailed: 'Upload failed',
  uploadDrag: 'Click or drag files here to upload',
  selectFile: 'Select file',
  imagePreview: 'Image preview',
  preview: 'Preview',
  loadFailed: 'Failed to load image',
  previewImage: 'Preview image',
  closePreview: 'Close preview',
  prevImage: 'Previous image',
  nextImage: 'Next image',
  zoomOut: 'Zoom out',
  zoomIn: 'Zoom in',
  actualSize: 'Actual size',
  rotateLeft: 'Rotate left',
  rotateRight: 'Rotate right',
  prevSlide: 'Previous slide',
  nextSlide: 'Next slide',
  goToSlide: 'Go to slide {index}',
  anchor: 'Anchor navigation',
  breadcrumb: 'Breadcrumb',
  avatar: 'Avatar',
  backTop: 'Back to top',
  floatButton: 'Floating button',
  scrollbar: 'Scrollable area',
  tabClose: 'Close tab',
  tabAdd: 'Add tab',
  progress: 'Progress {percent}%',
  slider: 'Slider {index}',
  qrcode: 'QR code',
  copy: 'Copy',
  copied: 'Copied',
  copyCode: 'Copy code',
  edit: 'Edit',
  chartValue: 'Value',
  chartPercent: 'Percent',
  chartTotal: 'Total',
  lineChart: 'Line chart: {categories} categories, {series} series',
  barChart: 'Bar chart: {categories} categories, {series} series',
  pieChart: 'Pie chart: {count} categories',
  gaugeChart: 'Gauge: {value}{unit} / {max}{unit}',
  radarChart: 'Radar chart: {count} indicators',
  scatterChart: 'Scatter chart: {count} points',
  funnelChart: 'Funnel chart: {count} stages',
  validationFailed: 'Validation failed',
  required: 'This field is required',
  email: 'Please enter a valid email address',
  url: 'Please enter a valid URL',
  array: 'Value must be an array',
  number: 'Please enter a number',
  min: 'Cannot be less than {min}',
  max: 'Cannot be greater than {max}',
  len: 'Length must be {len} characters',
  minLength: 'At least {min} characters',
  maxLength: 'At most {max} characters',
  pattern: 'Invalid format'
}

export interface BiliConfig {
  size: ComponentSize
  zIndex: number
  namespace: string
  locale: BiliLocale
}

export const defaultConfig: BiliConfig = {
  size: 'md',
  zIndex: 2000,
  namespace: 'bili',
  locale: zhCNLocale
}

export const configContextKey: InjectionKey<ComputedRef<BiliConfig>> = Symbol('bili-config')

let globalLocale: BiliLocale = zhCNLocale
let globalConfigValue: BiliConfig = { ...defaultConfig, locale: globalLocale }
const globalConfig = shallowRef<BiliConfig>(globalConfigValue)
const fallbackConfig = computed<BiliConfig>(() => globalConfig.value)

/** Imperative APIs (Message, Notification) read the locale set by ConfigProvider. */
export const setGlobalLocale = (locale: BiliLocale) => {
  if (globalLocale === locale) return
  globalLocale = locale
  globalConfigValue = { ...globalConfigValue, locale }
  globalConfig.value = globalConfigValue
}

export const getGlobalLocale = (): BiliLocale => globalLocale

/** Keep the fallback config (outside any provider) in sync with ConfigProvider. */
export const setGlobalConfigNamespace = (namespace: string) => {
  const next = namespace || 'bili'
  if (globalConfigValue.namespace === next) return
  globalConfigValue = { ...globalConfigValue, namespace: next }
  globalConfig.value = globalConfigValue
}

/** Read the merged configuration from the nearest ConfigProvider. */
export function useConfig(): ComputedRef<BiliConfig> {
  return inject(configContextKey, fallbackConfig)
}

/** Shorthand for the merged locale object. */
export function useLocale(): ComputedRef<BiliLocale> {
  const config = useConfig()
  return computed(() => config.value.locale)
}

/** Replace `{name}` placeholders in a locale template. */
export function formatLocale(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`
  )
}
