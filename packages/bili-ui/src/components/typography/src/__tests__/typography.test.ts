import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Text from '../text.vue'
import Title from '../title.vue'
import Paragraph from '../paragraph.vue'
import Link from '../link.vue'

describe('BiliText', () => {
  it('renders slot content in the requested tag', () => {
    const wrapper = mount(Text, { props: { tag: 'div' }, slots: { default: '正文' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.text()).toBe('正文')
    expect(wrapper.classes()).toContain('bili-text')
  })

  it('applies type and decoration classes', () => {
    const wrapper = mount(Text, {
      props: { type: 'secondary', strong: true, italic: true, underline: true }
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'bili-text--secondary',
        'is-strong',
        'is-italic',
        'is-underline'
      ])
    )
  })

  it('supports mark and code treatments', () => {
    const wrapper = mount(Text, { props: { mark: true, code: true } })
    expect(wrapper.classes()).toContain('is-mark')
    expect(wrapper.classes()).toContain('is-code')
  })

  it('applies single-line and multiline ellipsis', () => {
    const single = mount(Text, { props: { ellipsis: true } })
    expect(single.classes()).toContain('is-ellipsis')

    const multi = mount(Text, { props: { ellipsis: 2 } })
    expect(multi.classes()).toContain('is-ellipsis-multiline')
    expect(multi.attributes('style')).toContain('line-clamp: 2')
  })
})

describe('BiliTitle', () => {
  it('renders the matching heading level', () => {
    const wrapper = mount(Title, { props: { level: 3 }, slots: { default: '标题' } })
    expect(wrapper.element.tagName).toBe('H3')
    expect(wrapper.classes()).toContain('bili-title--level-3')
  })

  it('applies semantic tone and ellipsis', () => {
    const wrapper = mount(Title, { props: { type: 'danger', ellipsis: true } })
    expect(wrapper.classes()).toContain('bili-title--danger')
    expect(wrapper.classes()).toContain('is-ellipsis')
  })
})

describe('BiliParagraph', () => {
  it('renders a paragraph with spacing by default', () => {
    const wrapper = mount(Paragraph, { slots: { default: '段落' } })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('is-spacing')
  })

  it('can remove spacing and apply decoration', () => {
    const wrapper = mount(Paragraph, {
      props: { spacing: false, strong: true, delete: true }
    })
    expect(wrapper.classes()).not.toContain('is-spacing')
    expect(wrapper.classes()).toContain('is-strong')
    expect(wrapper.classes()).toContain('is-delete')
  })
})

describe('BiliLink', () => {
  it('renders href and target with safe rel for new tabs', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', target: '_blank' },
      slots: { default: '链接' }
    })
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
  })

  it('removes navigation for disabled links', () => {
    const wrapper = mount(Link, { props: { href: '/docs', disabled: true } })
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
