import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InputTag from '../input-tag.vue'

const mountTag = (props: Record<string, unknown> = {}) =>
  mount(InputTag, {
    attachTo: document.body,
    props: { modelValue: [], ...props }
  })

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliInputTag', () => {
  it('renders existing tags and the placeholder', () => {
    const wrapper = mountTag({ modelValue: ['vue', 'vite'], placeholder: 'Add a tag' })
    const tags = wrapper.findAll('.bili-input-tag__tag-text')

    expect(tags.map(tag => tag.text())).toEqual(['vue', 'vite'])
    expect(wrapper.find('.bili-input-tag__input').attributes('placeholder')).toBe('')

    const empty = mountTag({ placeholder: 'Add a tag' })
    expect(empty.find('.bili-input-tag__input').attributes('placeholder')).toBe('Add a tag')
  })

  it('adds a tag on Enter and emits the new array', async () => {
    const wrapper = mountTag()
    const input = wrapper.find('.bili-input-tag__input')

    await input.setValue('bili')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['bili']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['bili']])
    expect(wrapper.emitted('add')?.[0]).toEqual(['bili'])
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('commits tags when a delimiter is typed', async () => {
    const wrapper = mountTag()
    const input = wrapper.find('.bili-input-tag__input')

    await input.setValue('one,')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['one']])

    await input.setValue('two，')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['two']])
  })

  it('removes the last tag with Backspace in an empty input', async () => {
    const wrapper = mountTag({ modelValue: ['a', 'b'] })
    await wrapper.find('.bili-input-tag__input').trigger('keydown', { key: 'Backspace' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']])
    expect(wrapper.emitted('remove')?.[0]).toEqual(['b', 1])
  })

  it('removes a tag from its close button', async () => {
    const wrapper = mountTag({ modelValue: ['a', 'b'] })
    await wrapper.findAll('.bili-input-tag__tag-close')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b']])
  })

  it('respects max, duplicate and maxlength rules', async () => {
    const wrapper = mountTag({
      modelValue: ['vue'],
      max: 2,
      maxlength: 4
    })
    const input = wrapper.find('.bili-input-tag__input')

    await input.setValue('vue')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await input.setValue('assets')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['vue', 'asse']])
  })

  it('allows duplicates when allow-duplicate is set', async () => {
    const wrapper = mountTag({ modelValue: ['vue'], allowDuplicate: true })
    const input = wrapper.find('.bili-input-tag__input')

    await input.setValue('vue')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['vue', 'vue']])
  })

  it('commits the draft on blur and clears all tags', async () => {
    const wrapper = mountTag({ modelValue: ['a'], clearable: true })
    const input = wrapper.find('.bili-input-tag__input')

    await input.setValue('b')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])

    await wrapper.find('.bili-input-tag__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('does not add tags while composing IME text', async () => {
    const wrapper = mountTag()
    const input = wrapper.find('.bili-input-tag__input')

    await input.trigger('compositionstart')
    await input.setValue('zhong')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await input.trigger('compositionend')
    expect((input.element as HTMLInputElement).value).toBe('zhong')
  })
})
