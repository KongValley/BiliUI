import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InputSearch from '../search.vue'
import InputOtp from '../otp.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliInputSearch', () => {
  it('searches on Enter and on button click', async () => {
    const wrapper = mount(InputSearch, {
      attachTo: document.body,
      props: { modelValue: 'bili' }
    })

    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('search')?.[0]).toEqual(['bili'])

    await wrapper.find('.bili-input-search__button').trigger('click')
    expect(wrapper.emitted('search')).toHaveLength(2)
  })

  it('renders a text button with enter-button', () => {
    const wrapper = mount(InputSearch, {
      props: { enterButton: 'Search now' }
    })

    expect(wrapper.find('.bili-input-search__label').text()).toBe('Search now')
    expect(wrapper.find('.bili-input-search__button').classes()).toContain('is-text')
  })

  it('forwards input updates and clear events', async () => {
    const wrapper = mount(InputSearch, {
      props: { modelValue: 'bili', clearable: true }
    })

    await wrapper.find('input').setValue('vue')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['vue'])

    await wrapper.find('.bili-input__action').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('blocks searching while disabled or loading', async () => {
    const wrapper = mount(InputSearch, {
      props: { modelValue: 'bili', loading: true }
    })

    await wrapper.find('.bili-input-search__button').trigger('click')
    expect(wrapper.emitted('search')).toBeUndefined()
    expect(wrapper.find('.bili-input-search__button').attributes('disabled')).toBeDefined()
  })
})

describe('BiliInputOtp', () => {
  it('renders one cell per character with separators', () => {
    const wrapper = mount(InputOtp, {
      props: { modelValue: '12', length: 4, separator: '-' }
    })

    const cells = wrapper.findAll('.bili-input-otp__cell')
    expect(cells).toHaveLength(4)
    expect((cells[0].element as HTMLInputElement).value).toBe('1')
    expect(wrapper.findAll('.bili-input-otp__separator')).toHaveLength(3)
  })

  it('fills the next cell and emits the joined value', async () => {
    const wrapper = mount(InputOtp, { props: { length: 4 } })
    const cells = wrapper.findAll('.bili-input-otp__cell')

    await cells[0].setValue('1')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])

    await wrapper.setProps({ modelValue: '1' })
    await cells[1].setValue('2')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['12'])
  })

  it('distributes pasted text across cells and emits complete', () => {
    const wrapper = mount(InputOtp, {
      attachTo: document.body,
      props: { length: 6 }
    })
    const first = wrapper.find('.bili-input-otp__cell').element

    const event = new Event('paste', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'clipboardData', {
      value: { getData: () => '123456' }
    })
    first.dispatchEvent(event)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123456'])
    expect(wrapper.emitted('complete')?.[0]).toEqual(['123456'])
  })

  it('clears the current or previous cell with Backspace', async () => {
    const wrapper = mount(InputOtp, { props: { modelValue: '12', length: 4 } })
    const cells = wrapper.findAll('.bili-input-otp__cell')

    await cells[1].trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])

    await cells[2].trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['1'])
  })

  it('masks characters and disables cells', () => {
    const wrapper = mount(InputOtp, {
      props: { modelValue: '12', mask: true, disabled: true }
    })

    const cell = wrapper.find('.bili-input-otp__cell')
    expect(cell.attributes('type')).toBe('password')
    expect(cell.attributes('disabled')).toBeDefined()
  })
})
