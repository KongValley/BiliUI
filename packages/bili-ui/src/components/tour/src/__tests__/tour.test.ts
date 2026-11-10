import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Tour from '../tour.vue'
import ConfigProvider from '../../../config-provider/src/config-provider.vue'

const rect = (top: number, left: number, width: number, height: number): DOMRect =>
  ({
    top,
    bottom: top + height,
    left,
    right: left + width,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({})
  }) as DOMRect

const createTarget = (id: string, box = { top: 100, left: 50, width: 100, height: 40 }) => {
  const el = document.createElement('div')
  el.id = id
  el.getBoundingClientRect = () => rect(box.top, box.left, box.width, box.height)
  document.body.appendChild(el)
  return el
}

const steps = [
  { target: '#tour-a', title: '第一步', description: '介绍第一个功能' },
  { target: '#tour-b', title: '第二步', description: '介绍第二个功能' }
]

const mounted: Array<{ unmount: () => void }> = []

const track = <T extends { unmount: () => void }>(wrapper: T): T => {
  mounted.push(wrapper)
  return wrapper
}

const mountTour = (props: Record<string, unknown> = {}, slots?: Record<string, any>) => {
  createTarget('tour-a')
  createTarget('tour-b', { top: 300, left: 80, width: 120, height: 50 })
  return track(
    mount(Tour, {
      attachTo: document.body,
      props: {
        modelValue: 0,
        steps,
        scrollIntoView: false,
        ...props
      },
      slots
    })
  )
}

const popover = () => document.querySelector<HTMLElement>('.bili-tour__popover')

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

describe('BiliTour', () => {
  it('applies popper-class to the teleported tour root', async () => {
    mountTour({ popperClass: 'custom-tour-theme' })
    await nextTick()

    expect(document.querySelector('.bili-tour.custom-tour-theme')).not.toBeNull()
  })

  it('renders the current step with a cut-out mask', async () => {
    mountTour()
    await nextTick()

    expect(popover()?.textContent).toContain('第一步')
    expect(popover()?.textContent).toContain('介绍第一个功能')
    expect(document.querySelectorAll('.bili-tour__mask')).toHaveLength(4)
  })

  it('goes to the next step and emits events', async () => {
    const wrapper = mountTour()
    await nextTick()

    const next = document.querySelector<HTMLElement>('.bili-tour__button--next')!
    next.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([1])
    expect(wrapper.emitted('next')?.[0]).toEqual([1])

    await wrapper.setProps({ modelValue: 1 })
    expect(popover()?.textContent).toContain('第二步')
  })

  it('finishes on the last step and closes', async () => {
    const wrapper = mountTour({ modelValue: 1 })
    await nextTick()

    document.querySelector<HTMLElement>('.bili-tour__button--next')!.click()
    await nextTick()

    expect(wrapper.emitted('finish')?.[0]).toEqual([1])
    expect(wrapper.emitted('close')?.[0]).toEqual([1])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([-1])
  })

  it('goes back with the previous button', async () => {
    const wrapper = mountTour({ modelValue: 1 })
    await nextTick()

    const prev = document.querySelector<HTMLElement>('.bili-tour__button--prev')!
    expect(prev.textContent?.trim()).toBe('上一步')
    prev.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
    expect(wrapper.emitted('prev')?.[0]).toEqual([0])
  })

  it('closes from the close button and Escape', async () => {
    const wrapper = mountTour()
    await nextTick()

    document.querySelector<HTMLElement>('.bili-tour__close')!.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([-1])
    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
    mounted.splice(mounted.indexOf(wrapper), 1)
    document.body.innerHTML = ''

    const second = mountTour()
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(second.emitted('close')).toHaveLength(1)
  })

  it('supports indicator navigation', async () => {
    const wrapper = mountTour()
    await nextTick()

    const dots = document.querySelectorAll<HTMLElement>('.bili-tour__dot')
    expect(dots).toHaveLength(2)
    expect(dots[0].classList.contains('is-active')).toBe(true)

    dots[1].click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('can hide the mask or fall back to a full overlay', async () => {
    const noMask = mountTour({ mask: false })
    await nextTick()
    expect(document.querySelectorAll('.bili-tour__mask')).toHaveLength(0)
    noMask.unmount()
    mounted.splice(mounted.indexOf(noMask), 1)

    document.body.innerHTML = ''
    createTarget('tour-a')
    const missingTarget = track(
      mount(Tour, {
        attachTo: document.body,
        props: {
          modelValue: 0,
          steps: [{ target: '#missing', title: '无目标' }],
          scrollIntoView: false
        }
      })
    )
    await nextTick()
    expect(document.querySelectorAll('.bili-tour__mask')).toHaveLength(1)
    expect(document.querySelector('.bili-tour__popover')).not.toBeNull()
    expect(missingTarget.emitted('change')).toBeUndefined()
  })

  it('renders custom header and body slots', async () => {
    mountTour(
      {},
      {
        header: () => h('span', { class: 'custom-tour-header' }, '自定义标题'),
        default: ({ step }: { step: { title: string } }) =>
          h('div', { class: 'custom-tour-body' }, step.title)
      }
    )
    await nextTick()

    expect(document.querySelector('.custom-tour-header')?.textContent).toBe('自定义标题')
    expect(document.querySelector('.custom-tour-body')?.textContent).toBe('第一步')
  })

  it('uses ConfigProvider locale texts', async () => {
    createTarget('tour-a')
    track(
      mount(ConfigProvider, {
        attachTo: document.body,
        props: { locale: { prev: 'Back', next: 'Forward', finish: 'Done' } },
        slots: {
          default: () =>
            h(Tour, {
              modelValue: 1,
              steps: [
                { target: '#tour-a', title: 'One' },
                { target: '#tour-a', title: 'Two' }
              ],
              scrollIntoView: false
            })
        }
      })
    )
    await nextTick()

    expect(
      document.querySelector<HTMLElement>('.bili-tour__button--next')?.textContent?.trim()
    ).toBe('Done')
    expect(
      document.querySelector<HTMLElement>('.bili-tour__button--prev')?.textContent?.trim()
    ).toBe('Back')
  })

  it('renders nothing when the index is negative', async () => {
    mountTour({ modelValue: -1 })
    await nextTick()
    expect(document.querySelector('.bili-tour')).toBeNull()
  })

  it('hides the close button when requested', async () => {
    mountTour({ showClose: false })
    await nextTick()
    expect(document.querySelector('.bili-tour__close')).toBeNull()
  })
})
