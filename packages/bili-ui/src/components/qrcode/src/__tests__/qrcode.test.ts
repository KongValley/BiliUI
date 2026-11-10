import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import QRCode from '../qrcode.vue'
import ConfigProvider from '../../../config-provider/src/config-provider.vue'

const mountQRCode = (props: Record<string, unknown> = {}) =>
  mount(QRCode, { props: { value: 'https://bili-ui.dev', ...props } })

describe('BiliQRCode', () => {
  it('renders a square SVG with a quiet zone', () => {
    const wrapper = mountQRCode({ size: 200, margin: 2 })
    const svg = wrapper.find('.bili-qrcode__svg')
    const viewBox = svg.element.getAttribute('viewBox') || ''

    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('200')
    expect(svg.attributes('height')).toBe('200')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('二维码')

    const [, , width, height] = viewBox.split(' ')
    expect(width).toBe(height)
    expect(Number(width)).toBeGreaterThanOrEqual(25)
  })

  it('draws modules with the configured colours', () => {
    const wrapper = mountQRCode({ color: '#e0356b', background: '#fafafa' })
    const rect = wrapper.find('.bili-qrcode__svg rect')
    const path = wrapper.find('.bili-qrcode__svg path')

    expect(rect.attributes('fill')).toBe('#fafafa')
    expect(path.attributes('fill')).toBe('#e0356b')
    expect(path.attributes('d')).toContain('M')
  })

  it('renders a centred icon with a blank backing plate', async () => {
    const wrapper = mountQRCode({ icon: '/logo.svg', iconSize: 40, size: 160 })
    await nextTick()

    const svg = wrapper.find('.bili-qrcode__svg')
    const image = svg.find('image')
    const plate = svg.findAll('rect')[1]

    expect(image.exists()).toBe(true)
    expect(image.attributes('href')).toBe('/logo.svg')
    expect(Number(plate.attributes('width'))).toBeGreaterThan(0)
    expect(plate.attributes('fill')).toBe('#ffffff')
  })

  it('shows an empty state without a value', () => {
    const wrapper = mountQRCode({ value: '' })
    expect(wrapper.find('.bili-qrcode__svg').exists()).toBe(false)
    expect(wrapper.find('.bili-qrcode__empty').text()).toBe('暂无数据')
  })

  it('emits error and shows invalid text when the value is too long', async () => {
    const wrapper = mountQRCode({ value: 'x'.repeat(5000), errorLevel: 'H' })
    await nextTick()

    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.find('.bili-qrcode__empty').text()).toBe('内容无法生成')
  })

  it('uses the ConfigProvider locale for the empty state', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: { empty: 'No data' } },
      slots: {
        default: () => h(QRCode, { value: '' })
      }
    })

    expect(wrapper.find('.bili-qrcode__empty').text()).toBe('No data')
  })

  it('regenerates when the value changes', async () => {
    const wrapper = mountQRCode({ value: 'first' })
    const before = wrapper.find('.bili-qrcode__svg path').attributes('d')

    await wrapper.setProps({ value: 'second' })
    await nextTick()

    expect(wrapper.find('.bili-qrcode__svg path').attributes('d')).not.toBe(before)
  })

  it('applies the accessible label and wrapper size', () => {
    const wrapper = mountQRCode({ ariaLabel: '支付二维码', size: 240 })
    expect(wrapper.find('.bili-qrcode').attributes('style')).toContain('--bili-qrcode-size: 240px')
    expect(wrapper.find('.bili-qrcode__svg').attributes('aria-label')).toBe('支付二维码')
  })
})
