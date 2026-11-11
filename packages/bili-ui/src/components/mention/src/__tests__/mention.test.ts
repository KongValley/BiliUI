import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import Mention from '../mention.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { label: 'Alice', value: 'alice' },
  { label: 'Bob', value: 'bob' },
  { label: 'Charlie', value: 'charlie', disabled: true }
]

const mountMention = (props: Record<string, unknown> = {}) =>
  mount(Mention, { props: { options, ...props }, attachTo: document.body })

const mountControlled = (props: Record<string, unknown> = {}) => {
  const value = ref('')
  const Host = defineComponent({
    setup() {
      return () =>
        h(Mention, {
          options,
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (next: string) => (value.value = next)
        })
    }
  })
  const wrapper = mount(Host, { attachTo: document.body })
  return { wrapper, mention: wrapper.findComponent(Mention) }
}

const typeAt = async (
  wrapper: { find: (selector: string) => { element: unknown; trigger: (event: string) => Promise<void> } },
  value: string,
  caret = value.length
) => {
  const textarea = wrapper.find('textarea')
  const element = textarea.element as HTMLTextAreaElement
  element.value = value
  element.selectionStart = element.selectionEnd = caret
  await textarea.trigger('input')
}

const panelOptions = () =>
  [...document.querySelectorAll<HTMLElement>('.bili-mention__option')]

describe('BiliMention', () => {
  it('opens suggestions after typing the prefix', async () => {
    const wrapper = mountMention()
    await typeAt(wrapper, 'hello @al')
    await nextTick()

    expect(document.querySelector('.bili-mention__panel')).not.toBeNull()
    expect(panelOptions().map(option => option.textContent?.trim())).toEqual(['Alice'])
    expect(wrapper.emitted('search')?.[0]).toEqual(['al'])
  })

  it('filters options by the current query', async () => {
    const wrapper = mountMention()
    await typeAt(wrapper, '@bo')
    await nextTick()
    expect(panelOptions().map(option => option.textContent?.trim())).toEqual(['Bob'])
  })

  it('inserts the selected mention and appends the split text', async () => {
    const { wrapper, mention } = mountControlled()
    await typeAt(wrapper, 'hello @al')
    await nextTick()

    panelOptions()[0].click()
    await nextTick()

    expect(mention.emitted('update:modelValue')?.at(-1)).toEqual(['hello @Alice '])
    expect(mention.emitted('select')?.[0]).toEqual([
      { label: 'Alice', value: 'alice', disabled: false }
    ])
    expect(document.querySelector('.bili-mention__panel')).toBeNull()
  })

  it('supports keyboard navigation and enter selection', async () => {
    const { wrapper, mention } = mountControlled()
    const textarea = wrapper.find('textarea')
    await typeAt(wrapper, '@')
    await nextTick()

    await textarea.trigger('keydown', { key: 'ArrowDown' })
    await textarea.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(mention.emitted('update:modelValue')?.at(-1)).toEqual(['@Bob '])
  })

  it('closes when a space follows the query', async () => {
    const wrapper = mountMention()
    await typeAt(wrapper, '@alice smith')
    await nextTick()
    expect(document.querySelector('.bili-mention__panel')).toBeNull()
  })

  it('supports a custom prefix', async () => {
    const { wrapper, mention } = mountControlled({ prefix: '#' })
    await typeAt(wrapper, 'hi #bo')
    await nextTick()

    expect(panelOptions().map(option => option.textContent?.trim())).toEqual(['Bob'])
    panelOptions()[0].click()
    await nextTick()
    expect(mention.emitted('update:modelValue')?.at(-1)).toEqual(['hi #Bob '])
  })

  it('shows an empty state and ignores disabled input', async () => {
    const wrapper = mountMention()
    await typeAt(wrapper, '@zzz')
    await nextTick()
    expect(document.querySelector('.bili-mention__empty')?.textContent).toContain('暂无数据')

    wrapper.unmount()
    document.body.innerHTML = ''

    const disabled = mountMention({ disabled: true })
    await typeAt(disabled, '@al')
    await nextTick()
    expect(document.querySelector('.bili-mention__panel')).toBeNull()
  })
})
