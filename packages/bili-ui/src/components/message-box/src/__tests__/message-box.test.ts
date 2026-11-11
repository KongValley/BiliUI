import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MessageBox from '../message-box.vue'
import { BiliMessageBox, __resetMessageBoxes } from '../method'

const flush = async () => {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
}

const mountBox = (props: Record<string, unknown>) =>
  mount(MessageBox, {
    attachTo: document.body,
    props,
    global: { stubs: { teleport: true } }
  })

afterEach(() => {
  __resetMessageBoxes()
  document.body.innerHTML = ''
})

describe('BiliMessageBox', () => {
  it('renders title, message and actions', () => {
    const wrapper = mountBox({
      modelValue: true,
      title: 'Delete',
      message: 'This cannot be undone',
      showCancelButton: true
    })

    expect(wrapper.find('.bili-message-box__title').text()).toBe('Delete')
    expect(wrapper.find('.bili-message-box__message').text()).toBe('This cannot be undone')
    expect(wrapper.findAll('.bili-button')).toHaveLength(2)
  })

  it('emits confirm with the prompt value', async () => {
    const wrapper = mountBox({
      modelValue: true,
      input: true,
      inputValue: 'Bili'
    })

    await wrapper.find('.bili-message-box__input').setValue('Bili UI')
    await wrapper.find('.bili-button--primary').trigger('click')

    expect(wrapper.emitted('action')?.[0]).toEqual(['confirm', 'Bili UI'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('blocks confirm when the input pattern does not match', async () => {
    const wrapper = mountBox({
      modelValue: true,
      input: true,
      inputPattern: /^\d+$/
    })

    await wrapper.find('.bili-message-box__input').setValue('abc')
    await wrapper.find('.bili-button--primary').trigger('click')

    expect(wrapper.emitted('action')).toBeUndefined()
    expect(wrapper.find('.bili-message-box__error').exists()).toBe(true)

    await wrapper.find('.bili-message-box__input').setValue('123')
    await wrapper.find('.bili-button--primary').trigger('click')
    expect(wrapper.emitted('action')?.[0]).toEqual(['confirm', '123'])
  })

  it('supports async before-close and the loading state', async () => {
    let done: (() => void) | null = null
    const wrapper = mountBox({
      modelValue: true,
      message: 'Sure?',
      showCancelButton: true,
      beforeClose: (_action: string, _instance: unknown, finish: () => void) => {
        done = finish
      }
    })

    await wrapper.find('.bili-button--primary').trigger('click')
    expect(wrapper.emitted('action')).toBeUndefined()

    ;(done as (() => void) | null)?.()
    expect(wrapper.emitted('action')?.[0]).toEqual(['confirm', ''])
  })

  it('creates an imperative confirm and resolves on confirm', async () => {
    const promise = BiliMessageBox.confirm('Delete this item?', 'Warning')
    await flush()

    const button = document.body.querySelector<HTMLElement>('.bili-button--primary')
    expect(button).not.toBeNull()
    button!.click()

    await expect(promise).resolves.toEqual({ action: 'confirm', value: '' })
  })

  it('rejects on cancel and supports prompt values', async () => {
    const promise = BiliMessageBox.prompt('Rename', 'Name')
    await flush()

    const input = document.body.querySelector<HTMLInputElement>('.bili-message-box__input')!
    input.value = 'new-name'
    input.dispatchEvent(new Event('input'))

    const confirm = document.body.querySelector<HTMLElement>('.bili-button--primary')!
    confirm.click()

    await expect(promise).resolves.toEqual({ action: 'confirm', value: 'new-name' })
  })

  it('rejects when the dialog is cancelled', async () => {
    const promise = BiliMessageBox.confirm('Delete?')
    await flush()

    document.body.querySelector<HTMLElement>('.bili-message-box__close')!.click()
    await expect(promise).rejects.toBe('close')
  })

  it('closeAll dismisses open dialogs', async () => {
    const first = BiliMessageBox.alert('First')
    await flush()

    BiliMessageBox.closeAll()
    await expect(first).rejects.toBe('close')
  })
})
