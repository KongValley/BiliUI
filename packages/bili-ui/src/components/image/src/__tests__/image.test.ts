import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Image from '../image.vue'

const urls = ['/one.png', '/two.png', '/three.png']

const mountImage = (props: Record<string, unknown> = {}) =>
  mount(Image, {
    props: {
      src: '/cover.png',
      alt: '封面',
      ...props
    },
    attachTo: document.body
  })

const viewerEl = () => document.body.querySelector<HTMLElement>('.bili-image-viewer')

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliImage', () => {
  it('renders the image with fit and fixed dimensions', () => {
    const wrapper = mountImage({ fit: 'cover', width: 200, height: '120px' })
    const img = wrapper.find('.bili-image__inner')

    expect(img.attributes('src')).toBe('/cover.png')
    expect(img.attributes('alt')).toBe('封面')
    expect(img.attributes('style')).toContain('object-fit: cover')
    expect(wrapper.attributes('style')).toContain('width: 200px')
    expect(wrapper.attributes('style')).toContain('height: 120px')
  })

  it('shows the placeholder until load and emits load', async () => {
    const wrapper = mountImage()
    expect(wrapper.find('.bili-image__placeholder').exists()).toBe(true)

    await wrapper.find('.bili-image__inner').trigger('load')

    expect(wrapper.find('.bili-image__placeholder').exists()).toBe(false)
    expect(wrapper.classes()).toContain('is-loaded')
    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  it('renders a custom error state', async () => {
    const wrapper = mount(Image, {
      props: { src: '/broken.png' },
      slots: { error: '<span class="custom-error">加载失败</span>' }
    })

    await wrapper.find('.bili-image__inner').trigger('error')

    expect(wrapper.classes()).toContain('is-error')
    expect(wrapper.find('.custom-error').exists()).toBe(true)
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('opens the preview dialog at the initial index', async () => {
    const wrapper = mountImage({ previewSrcList: urls, initialIndex: 1 })

    await wrapper.find('.bili-image__preview-mask').trigger('click')
    await nextTick()

    const viewer = viewerEl()
    expect(viewer).not.toBeNull()
    expect(viewer!.querySelector('.bili-image-viewer__counter')?.textContent).toContain('2 / 3')
    expect(viewer!.querySelector<HTMLImageElement>('.bili-image-viewer__img')?.src).toContain(
      '/two.png'
    )
    expect(wrapper.emitted('show')).toHaveLength(1)
  })

  it('switches between images and emits switch', async () => {
    const wrapper = mountImage({ previewSrcList: urls })

    await wrapper.find('.bili-image__preview-mask').trigger('click')
    await nextTick()

    const next = viewerEl()!.querySelector<HTMLElement>('[aria-label="下一张"]')!
    next.click()
    await nextTick()

    expect(viewerEl()!.querySelector('.bili-image-viewer__counter')?.textContent).toContain('2 / 3')
    expect(wrapper.emitted('switch')?.[0]).toEqual([1])

    const prev = viewerEl()!.querySelector<HTMLElement>('[aria-label="上一张"]')!
    prev.click()
    await nextTick()

    expect(viewerEl()!.querySelector('.bili-image-viewer__counter')?.textContent).toContain('1 / 3')
    expect(wrapper.emitted('switch')?.[1]).toEqual([0])
  })

  it('zooms, rotates and resets the current image', async () => {
    const wrapper = mountImage({ previewSrcList: urls, maxScale: 1.5 })

    await wrapper.find('.bili-image__preview-mask').trigger('click')
    await nextTick()

    const zoomIn = viewerEl()!.querySelector<HTMLElement>('[title="放大"]')!
    zoomIn.click()
    await nextTick()
    expect(viewerEl()!.querySelector('.bili-image-viewer__scale')?.textContent).toBe('125%')

    zoomIn.click()
    await nextTick()
    expect(viewerEl()!.querySelector('.bili-image-viewer__scale')?.textContent).toBe('150%')

    const rotate = viewerEl()!.querySelector<HTMLElement>('[title="向右旋转"]')!
    rotate.click()
    await nextTick()
    expect(
      viewerEl()!.querySelector<HTMLImageElement>('.bili-image-viewer__img')?.style.transform
    ).toContain('rotate(90deg)')

    const reset = viewerEl()!.querySelector<HTMLElement>('[title="实际大小"]')!
    reset.click()
    await nextTick()
    expect(viewerEl()!.querySelector('.bili-image-viewer__scale')?.textContent).toBe('100%')
  })

  it('closes on backdrop click only when hide-on-click-modal is set', async () => {
    const wrapper = mountImage({ previewSrcList: urls })
    await wrapper.find('.bili-image__preview-mask').trigger('click')
    await nextTick()

    viewerEl()!.click()
    await nextTick()
    expect(viewerEl()).not.toBeNull()

    await wrapper.setProps({ hideOnClickModal: true })
    viewerEl()!.click()
    await nextTick()

    expect(document.body.querySelector('.bili-image-viewer')).toBeNull()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('closes on Escape when allowed', async () => {
    const wrapper = mountImage({ previewSrcList: urls })
    await wrapper.find('.bili-image__preview-mask').trigger('click')
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(document.body.querySelector('.bili-image-viewer')).toBeNull()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('exposes showPreview and closePreview', async () => {
    const wrapper = mountImage({ previewSrcList: urls })

    wrapper.vm.showPreview(2)
    await nextTick()
    expect(viewerEl()!.querySelector('.bili-image-viewer__counter')?.textContent).toContain('3 / 3')

    wrapper.vm.closePreview()
    await nextTick()
    expect(document.body.querySelector('.bili-image-viewer')).toBeNull()
  })
})
