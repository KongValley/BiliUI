import { isEmpty } from '../../../utils/is'
import type { FormItemRule } from './types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^https?:\/\/[^\s/$.?#][^\s]*$/i

const getLength = (value: unknown): number => {
  if (Array.isArray(value)) return value.length
  return String(value ?? '').length
}

const runValidator = async (
  rule: FormItemRule,
  value: any,
  model: Record<string, any>
): Promise<void> => {
  if (!rule.validator) return
  const result = await rule.validator(value, rule, model)
  if (result === false) {
    throw new Error(rule.message || '校验未通过')
  }
  if (typeof result === 'string' && result) {
    throw new Error(result)
  }
}

export async function validateRule(
  rule: FormItemRule,
  value: any,
  model: Record<string, any>
): Promise<void> {
  if (rule.required && isEmpty(value)) {
    throw new Error(rule.message || '此项为必填项')
  }

  if (isEmpty(value)) {
    if (rule.validator) await runValidator(rule, value, model)
    return
  }

  const type = rule.type ?? (typeof value === 'number' ? 'number' : 'string')

  if (type === 'email' && !EMAIL_REGEX.test(String(value))) {
    throw new Error(rule.message || '请输入正确的邮箱地址')
  }

  if (type === 'url' && !URL_REGEX.test(String(value))) {
    throw new Error(rule.message || '请输入正确的网址')
  }

  if (type === 'array' && !Array.isArray(value)) {
    throw new Error(rule.message || '值必须为数组')
  }

  if (type === 'number') {
    const numberValue = Number(value)
    if (Number.isNaN(numberValue)) {
      throw new Error(rule.message || '请输入数字')
    }
    if (rule.min !== undefined && numberValue < rule.min) {
      throw new Error(rule.message || `不能小于 ${rule.min}`)
    }
    if (rule.max !== undefined && numberValue > rule.max) {
      throw new Error(rule.message || `不能大于 ${rule.max}`)
    }
  } else {
    const length = getLength(value)
    if (rule.len !== undefined && length !== rule.len) {
      throw new Error(rule.message || `长度应为 ${rule.len} 个字符`)
    }
    if (rule.min !== undefined && length < rule.min) {
      throw new Error(rule.message || `最少 ${rule.min} 个字符`)
    }
    if (rule.max !== undefined && length > rule.max) {
      throw new Error(rule.message || `最多 ${rule.max} 个字符`)
    }
  }

  if (rule.pattern && !rule.pattern.test(String(value))) {
    throw new Error(rule.message || '格式不正确')
  }

  await runValidator(rule, value, model)
}
