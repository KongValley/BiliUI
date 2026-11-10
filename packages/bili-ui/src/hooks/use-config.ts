import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'
import type { ComponentSize } from '../utils/types'

export interface BiliLocale {
  /** Confirm button text. */
  confirm: string
  /** Cancel button text. */
  cancel: string
  /** Close button label. */
  close: string
  /** Generic empty state text. */
  empty: string
  /** Invalid content text (e.g. QRCode encoding failure). */
  invalid: string
  /** Previous-step text. */
  prev: string
  /** Next-step text. */
  next: string
  /** Finish text. */
  finish: string
  /** Pagination total template, supports `{total}`. */
  total: string
  /** Page-size option template, supports `{size}`. */
  pageSize: string
  /** Page-size select label. */
  pageSizeLabel: string
  /** Previous-page label. */
  prevPage: string
  /** Next-page label. */
  nextPage: string
  /** Jump-to text. */
  jumpTo: string
  /** Jump input label. */
  jumpToPage: string
  /** Page unit text. */
  page: string
}

export const zhCNLocale: BiliLocale = {
  confirm: '确定',
  cancel: '取消',
  close: '关闭',
  empty: '暂无数据',
  invalid: '内容无法生成',
  prev: '上一步',
  next: '下一步',
  finish: '完成',
  total: '共 {total} 条',
  pageSize: '{size} 条/页',
  pageSizeLabel: '每页条数',
  prevPage: '上一页',
  nextPage: '下一页',
  jumpTo: '前往',
  jumpToPage: '跳转到页码',
  page: '页'
}

export interface BiliConfig {
  size: ComponentSize
  zIndex: number
  locale: BiliLocale
}

export const defaultConfig: BiliConfig = {
  size: 'md',
  zIndex: 2000,
  locale: zhCNLocale
}

export const configContextKey: InjectionKey<ComputedRef<BiliConfig>> = Symbol('bili-config')

/** Read the merged configuration from the nearest ConfigProvider. */
export function useConfig(): ComputedRef<BiliConfig> {
  return inject(
    configContextKey,
    computed(() => defaultConfig)
  )
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
