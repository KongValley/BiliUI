import { isEmpty } from '../../../utils/is'
import { formatLocale, zhCNLocale, type BiliLocale } from '../../../hooks/use-config'
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
  model: Record<string, any>,
  locale: BiliLocale
): Promise<void> => {
  if (!rule.validator) return
  const result = await rule.validator(value, rule, model)
  if (result === false) {
    throw new Error(rule.message || locale.validationFailed)
  }
  if (typeof result === 'string' && result) {
    throw new Error(result)
  }
}

export async function validateRule(
  rule: FormItemRule,
  value: any,
  model: Record<string, any>,
  locale: BiliLocale = zhCNLocale
): Promise<void> {
  if (rule.required && isEmpty(value)) {
    throw new Error(rule.message || locale.required)
  }

  if (isEmpty(value)) {
    if (rule.validator) await runValidator(rule, value, model, locale)
    return
  }

  const type = rule.type ?? (typeof value === 'number' ? 'number' : 'string')

  if (type === 'email' && !EMAIL_REGEX.test(String(value))) {
    throw new Error(rule.message || locale.email)
  }

  if (type === 'url' && !URL_REGEX.test(String(value))) {
    throw new Error(rule.message || locale.url)
  }

  if (type === 'array' && !Array.isArray(value)) {
    throw new Error(rule.message || locale.array)
  }

  if (type === 'number') {
    const numberValue = Number(value)
    if (Number.isNaN(numberValue)) {
      throw new Error(rule.message || locale.number)
    }
    if (rule.min !== undefined && numberValue < rule.min) {
      throw new Error(
        rule.message || formatLocale(locale.min, { min: rule.min })
      )
    }
    if (rule.max !== undefined && numberValue > rule.max) {
      throw new Error(
        rule.message || formatLocale(locale.max, { max: rule.max })
      )
    }
  } else {
    const length = getLength(value)
    if (rule.len !== undefined && length !== rule.len) {
      throw new Error(rule.message || formatLocale(locale.len, { len: rule.len }))
    }
    if (rule.min !== undefined && length < rule.min) {
      throw new Error(
        rule.message || formatLocale(locale.minLength, { min: rule.min })
      )
    }
    if (rule.max !== undefined && length > rule.max) {
      throw new Error(
        rule.message || formatLocale(locale.maxLength, { max: rule.max })
      )
    }
  }

  if (rule.pattern && !rule.pattern.test(String(value))) {
    throw new Error(rule.message || locale.pattern)
  }

  await runValidator(rule, value, model, locale)
}
