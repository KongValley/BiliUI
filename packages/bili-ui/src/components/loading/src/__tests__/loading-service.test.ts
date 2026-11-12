import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { loadingService, __resetLoadingService } from '../service'
import { BiliLoading } from '../../index'

const settle = async () => {
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, 160))
}

afterEach(async () => {
  __resetLoadingService()
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

describe('BiliLoading.service', () => {
  it('is exposed on the Loading component', () => {
    expect(BiliLoading.service).toBe(loadingService)
  })

  it('renders a fullscreen mask and locks the body', () => {
    const instance = loadingService({ text: '加载中' })
    const mask = document.body.querySelector<HTMLElement>('.bili-loading')

    expect(mask).not.toBeNull()
    expect(mask?.classList.contains('is-fullscreen')).toBe(true)
    expect(mask?.textContent).toContain('加载中')
    expect(document.body.style.overflow).toBe('hidden')
    expect(instance.visible).toBe(true)
  })

  it('updates the text while visible', async () => {
    const instance = loadingService({ text: '第一步' })
    instance.setText('第二步')
    await nextTick()

    const mask = document.body.querySelector<HTMLElement>('.bili-loading')
    expect(mask?.textContent).toContain('第二步')
  })

  it('closes the mask and restores body scrolling', async () => {
    const instance = loadingService({ text: '保存中' })
    instance.close()
    await settle()

    expect(document.body.querySelector('.bili-loading')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(instance.visible).toBe(false)
  })

  it('keeps the lock while multiple masks are open', async () => {
    const first = loadingService()
    const second = loadingService()

    first.close()
    await settle()
    expect(document.body.style.overflow).toBe('hidden')

    second.close()
    await settle()
    expect(document.body.style.overflow).toBe('')
  })

  it('renders an overlay inside a target element', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const instance = loadingService({ target, text: '局部' })
    const mask = target.querySelector<HTMLElement>('.bili-loading')

    expect(mask?.classList.contains('is-overlay')).toBe(true)
    expect(target.style.position).toBe('relative')

    instance.close()
    await settle()
    expect(target.style.position).toBe('')
    expect(target.querySelector('.bili-loading')).toBeNull()
  })

  it('accepts a selector target', () => {
    const target = document.createElement('div')
    target.id = 'loading-target'
    document.body.appendChild(target)

    const instance = loadingService({ target: '#loading-target' })
    expect(target.querySelector('.bili-loading')).not.toBeNull()
    instance.close()
  })

  it('warns and falls back to fullscreen for a missing target', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const instance = loadingService({ target: '#missing' })

    expect(warn).toHaveBeenCalledWith('[BiliLoading] target not found: #missing')
    expect(document.body.querySelector('.bili-loading')?.classList.contains('is-fullscreen')).toBe(
      true
    )
    instance.close()
  })

  it('supports background and custom classes', () => {
    const instance = loadingService({ background: 'rgba(0,0,0,.4)', customClass: 'my-mask' })
    const mask = document.body.querySelector<HTMLElement>('.bili-loading')

    expect(mask?.classList.contains('my-mask')).toBe(true)
    expect(mask?.style.background).toBe('rgba(0, 0, 0, 0.4)')
    instance.close()
  })
})
