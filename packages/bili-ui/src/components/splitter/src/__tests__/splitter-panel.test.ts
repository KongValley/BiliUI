import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import Splitter from '../splitter.vue'
import SplitterPanel from '../splitter-panel.vue'

const mountPanels = (
  props: Record<string, unknown> = {},
  panels: Array<Record<string, unknown>> = [{ size: 40 }, { size: 60 }]
) =>
  mount(Splitter, {
    props,
    slots: {
      default: () =>
        panels.map((panel, index) =>
          h(
            SplitterPanel,
            { key: index, ...panel, class: `panel-${index}` },
            { default: () => `面板 ${index + 1}` }
          )
        )
    }
  })

const panelStyles = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('.bili-splitter__panel').map(node => node.attributes('style') ?? '')

describe('BiliSplitter panels', () => {
  it('renders multiple panels with dividers between them', async () => {
    const wrapper = mountPanels({}, [{}, {}, {}])
    await nextTick()

    expect(wrapper.classes()).toContain('is-panels')
    expect(wrapper.findAll('.bili-splitter__panel')).toHaveLength(3)
    expect(wrapper.findAll('.bili-splitter__divider')).toHaveLength(2)
    expect(wrapper.text()).toContain('面板 1')
    expect(wrapper.text()).toContain('面板 3')
  })

  it('distributes panels equally when no size is given', async () => {
    const wrapper = mountPanels({}, [{}, {}, {}])
    await nextTick()

    const nodes = wrapper.findAll('.bili-splitter__panel')
    expect(nodes).toHaveLength(3)
    const styles = nodes.map(node => node.attributes('style') ?? '')
    const sizes = styles.map(style => Number.parseFloat(style.match(/0 0 ([\d.]+)%/)?.[1] ?? '0'))
    sizes.forEach(size => expect(size).toBeCloseTo(33.33, 1))
  })

  it('honours panel size props', async () => {
    const wrapper = mountPanels()
    await nextTick()

    const styles = panelStyles(wrapper)
    expect(styles[0]).toContain('40%')
    expect(styles[1]).toContain('60%')
  })

  it('resizes two panels by dragging the divider', async () => {
    const wrapper = mountPanels()
    await nextTick()

    const root = wrapper.element as HTMLElement
    Object.defineProperty(root, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 300, height: 200, right: 300, bottom: 200 })
    })

    const divider = wrapper.find('.bili-splitter__divider').element
    divider.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, bubbles: true }))
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 160 }))
    await nextTick()

    expect(wrapper.emitted('update:sizes')?.at(-1)?.[0]).toEqual([60, 40])
    expect(wrapper.classes()).toContain('is-dragging')

    document.dispatchEvent(new MouseEvent('pointerup'))
    await nextTick()
    expect(wrapper.emitted('resize-end')).toHaveLength(1)
  })

  it('resizes with the keyboard and exposes separator ARIA values', async () => {
    const wrapper = mountPanels()
    await nextTick()

    const divider = wrapper.find('.bili-splitter__divider')
    expect(divider.attributes('aria-valuenow')).toBe('40')
    expect(divider.attributes('aria-valuemin')).toBe('0')
    expect(divider.attributes('aria-valuemax')).toBe('100')

    await divider.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:sizes')?.at(-1)?.[0]).toEqual([45, 55])

    await divider.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:sizes')?.at(-1)?.[0]).toEqual([40, 60])
  })

  it('collapses and restores a collapsible panel on double click', async () => {
    const wrapper = mountPanels({}, [{ size: 40 }, { size: 60, collapsible: true }])
    await nextTick()

    const divider = wrapper.find('.bili-splitter__divider')
    await divider.trigger('dblclick')
    expect(wrapper.emitted('collapse')?.[0]).toEqual([1, true])
    expect(panelStyles(wrapper)[1]).toContain('0%')

    await divider.trigger('dblclick')
    expect(wrapper.emitted('collapse')?.[1]).toEqual([1, false])
    expect(panelStyles(wrapper)[1]).toContain('60%')
  })

  it('respects controlled sizes', async () => {
    const wrapper = mountPanels({ sizes: [30, 70] })
    await nextTick()

    expect(panelStyles(wrapper)[0]).toContain('30%')
    expect(panelStyles(wrapper)[1]).toContain('70%')

    const root = wrapper.element as HTMLElement
    Object.defineProperty(root, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 })
    })
    const divider = wrapper.find('.bili-splitter__divider').element
    divider.dispatchEvent(new MouseEvent('pointerdown', { clientX: 60, bubbles: true }))
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 100 }))
    await nextTick()

    expect(wrapper.emitted('update:sizes')?.at(-1)?.[0]).toEqual([50, 50])
    // Controlled: the parent did not update the prop, so the layout stays put.
    expect(panelStyles(wrapper)[0]).toContain('30%')
  })

  it('disables dividers when a panel is not resizable', async () => {
    const wrapper = mountPanels({}, [{ size: 40 }, { size: 60, resizable: false }])
    await nextTick()

    expect(wrapper.find('.bili-splitter__divider').attributes('tabindex')).toBe('-1')
  })

  it('supports vertical panel layouts', async () => {
    const wrapper = mountPanels({ direction: 'vertical' })
    await nextTick()

    expect(wrapper.classes()).toContain('bili-splitter--vertical')
    expect(wrapper.find('.bili-splitter__divider').attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.find('.bili-splitter__divider').attributes('style')).toContain('height: 6px')
  })

  it('updates sizes when a panel size prop changes', async () => {
    const firstSize = ref(40)
    const Host = defineComponent({
      setup() {
        return { firstSize }
      },
      render() {
        return h(Splitter, null, {
          default: () => [
            h(SplitterPanel, { size: firstSize.value }, () => '左侧'),
            h(SplitterPanel, { size: 60 }, () => '右侧')
          ]
        })
      }
    })

    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.findComponent(Splitter).emitted('update:sizes')).toBeUndefined()

    firstSize.value = 20
    await nextTick()
    await nextTick()

    expect(wrapper.findComponent(Splitter).emitted('update:sizes')?.at(-1)?.[0]).toEqual([20, 80])
  })
})
