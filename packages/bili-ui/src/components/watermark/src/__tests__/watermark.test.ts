import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Watermark from '../watermark.vue'

const context = {
  scale: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  fillText: vi.fn(),
  textAlign: '',
  textBaseline: '',
  fillStyle: '',
  font: ''
}

const mountWatermark = (props: Record<string, unknown> = {}) =>
  mount(Watermark, {
    props: {
      content: 'Bili UI',
      gap: [20, 30],
      offset: [5, 10],
      ...props
    },
    slots: { default: '<div class="watermark-content">内容</div>' }
  })

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as never)
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,TEST')
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('BiliWatermark', () => {
  it('renders slot content and a repeating overlay', () => {
    const wrapper = mountWatermark()
    const overlay = wrapper.find('.bili-watermark__overlay')

    expect(wrapper.find('.watermark-content').text()).toBe('内容')
    expect(overlay.attributes('style')).toContain(
      '--bili-watermark-image: url("data:image/png;base64,TEST")'
    )
    expect(overlay.attributes('style')).toContain('--bili-watermark-size: 140px 94px')
    expect(overlay.attributes('style')).toContain('--bili-watermark-position: 5px 10px')
    expect(overlay.attributes('style')).toContain('--bili-watermark-z-index: 9')
  })

  it('draws text with font, rotation and gap options', () => {
    mountWatermark({ font: { color: '#ff0000', fontSize: 20, fontWeight: 600 } })

    expect(context.rotate).toHaveBeenCalledWith((-22 * Math.PI) / 180)
    expect(context.fillStyle).toBe('#ff0000')
    expect(context.font).toContain('600 20px')
    expect(context.fillText).toHaveBeenCalledWith('Bili UI', 0, expect.any(Number))
  })

  it('renders multiple lines', () => {
    mountWatermark({ content: ['第一行', '第二行'] })

    expect(context.fillText).toHaveBeenCalledTimes(2)
    expect(context.fillText).toHaveBeenNthCalledWith(1, '第一行', 0, expect.any(Number))
    expect(context.fillText).toHaveBeenNthCalledWith(2, '第二行', 0, expect.any(Number))
  })

  it('hides the overlay when no content is provided', () => {
    const wrapper = mountWatermark({ content: '' })
    const overlay = wrapper.find('.bili-watermark__overlay')

    expect(overlay.classes()).toContain('is-empty')
    expect(context.fillText).not.toHaveBeenCalled()
  })

  it('regenerates when the content changes', async () => {
    const wrapper = mountWatermark()
    expect(context.fillText).toHaveBeenCalledTimes(1)

    await wrapper.setProps({ content: '新的水印' })
    await nextTick()

    expect(context.fillText).toHaveBeenCalledTimes(2)
    expect(context.fillText).toHaveBeenLastCalledWith('新的水印', 0, expect.any(Number))
  })

  it('draws an image watermark when image is provided', async () => {
    class FakeImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      crossOrigin = ''
      set src(_value: string) {
        queueMicrotask(() => this.onload?.())
      }
    }
    vi.stubGlobal('Image', FakeImage)

    const wrapper = mountWatermark({ image: '/watermark.png' })
    await flushPromises()
    await nextTick()

    expect(context.drawImage).toHaveBeenCalledTimes(1)
    expect(context.fillText).not.toHaveBeenCalled()
    expect(wrapper.find('.bili-watermark__overlay').attributes('style')).toContain(
      '--bili-watermark-image'
    )
  })

  it('applies a numeric gap to both axes and custom z-index', () => {
    const wrapper = mountWatermark({ gap: 10, zIndex: 20 })
    const style = wrapper.find('.bili-watermark__overlay').attributes('style') || ''

    expect(style).toContain('--bili-watermark-size: 130px 74px')
    expect(style).toContain('--bili-watermark-z-index: 20')
  })
})
