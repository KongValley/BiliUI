/* eslint-disable vue/one-component-per-file */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import ConfigProvider from '../config-provider.vue'
import { useConfig, useLocale, formatLocale } from '../../../../hooks/use-config'
import { useZIndex } from '../../../../hooks/use-z-index'
import BiliButton from '../../../button/src/button.vue'
import BiliInput from '../../../input/src/input.vue'
import BiliSelect from '../../../select/src/select.vue'
import BiliInputNumber from '../../../input-number/src/input-number.vue'
import BiliPopconfirm from '../../../popover/src/popconfirm.vue'
import BiliPagination from '../../../pagination/src/pagination.vue'
import BiliDialog from '../../../dialog/src/dialog.vue'

const ConfigProbe = defineComponent({
  setup() {
    const config = useConfig()
    const locale = useLocale()
    return () =>
      h(
        'div',
        { class: 'config-probe' },
        `${config.value.size}|${config.value.zIndex}|${locale.value.next}`
      )
  }
})

const ZIndexProbe = defineComponent({
  setup() {
    const { nextZIndex } = useZIndex()
    const value = ref(0)
    return () =>
      h(
        'button',
        { class: 'z-probe', onClick: () => (value.value = nextZIndex()) },
        String(value.value)
      )
  }
})

describe('BiliConfigProvider', () => {
  it('provides default configuration without a provider', () => {
    const wrapper = mount(ConfigProbe)
    expect(wrapper.text()).toBe('md|2000|下一步')
  })

  it('provides size, z-index and locale to descendants', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'sm', zIndex: 3000, locale: { next: 'Continue' } },
      slots: { default: () => h(ConfigProbe) }
    })

    expect(wrapper.find('.config-probe').text()).toBe('sm|3000|Continue')
  })

  it('merges nested providers and lets the nearest one win', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'lg', locale: { next: 'Outer', finish: 'Outer done' } },
      slots: {
        default: () =>
          h(
            ConfigProvider,
            { size: 'sm', locale: { finish: 'Inner done' } },
            { default: () => h(ConfigProbe) }
          )
      }
    })

    expect(wrapper.find('.config-probe').text()).toBe('sm|2000|Outer')
  })

  it('applies the configured size to controls and keeps explicit sizes', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'lg' },
      slots: {
        default: () =>
          h('div', [
            h(BiliButton, null, () => '按钮'),
            h(BiliButton, { size: 'sm' }, () => '小按钮'),
            h(BiliInput),
            h(BiliSelect, { options: [{ label: 'A', value: 'a' }] }),
            h(BiliInputNumber, { modelValue: 1 })
          ])
      }
    })

    expect(wrapper.find('.bili-button').classes()).toContain('bili-button--lg')
    expect(wrapper.findAll('.bili-button')[1].classes()).toContain('bili-button--sm')
    expect(wrapper.find('.bili-input').classes()).toContain('bili-input--lg')
    expect(wrapper.find('.bili-select').classes()).toContain('bili-select--lg')
    expect(wrapper.find('.bili-input-number').classes()).toContain('bili-input-number--lg')
  })

  it('raises the z-index floor for overlays', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { zIndex: 4000 },
      slots: { default: () => h(ZIndexProbe) }
    })

    await wrapper.find('.z-probe').trigger('click')
    expect(Number(wrapper.find('.z-probe').text())).toBeGreaterThan(4000)
  })

  it('localises popconfirm buttons', async () => {
    mount(ConfigProvider, {
      attachTo: document.body,
      props: { locale: { confirm: 'Apply', cancel: 'Discard' } },
      slots: {
        default: () =>
          h(
            BiliPopconfirm,
            { content: '确认操作？', trigger: 'click' },
            { default: () => h('button', { class: 'popconfirm-trigger' }, '删除') }
          )
      }
    })

    document.querySelector<HTMLElement>('.popconfirm-trigger')!.click()
    await nextTick()
    await nextTick()

    const actions = document.querySelector('.bili-popconfirm__actions')
    expect(actions?.textContent).toContain('Apply')
    expect(actions?.textContent).toContain('Discard')
  })

  it('localises pagination texts', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        locale: {
          total: 'Total {total} items',
          pageSize: '{size} / page',
          prevPage: 'Previous page',
          nextPage: 'Next page',
          jumpTo: 'Go to',
          page: 'page',
          pageSizeLabel: 'Page size'
        }
      },
      slots: {
        default: () =>
          h(BiliPagination, {
            total: 100,
            currentPage: 2,
            layout: 'total, sizes, prev, next, jumper'
          })
      }
    })

    expect(wrapper.find('.bili-pagination__total').text()).toBe('Total 100 items')
    expect(wrapper.find('.bili-pagination__sizes').text()).toContain('10 / page')
    expect(wrapper.find('.bili-pagination__prev').attributes('aria-label')).toBe('Previous page')
    expect(wrapper.find('.bili-pagination__next').attributes('aria-label')).toBe('Next page')
    expect(wrapper.find('.bili-pagination__jumper').text()).toContain('Go to')
    expect(wrapper.find('.bili-pagination__jumper').text()).toContain('page')
  })

  it('localises the dialog close label', async () => {
    mount(ConfigProvider, {
      attachTo: document.body,
      props: { locale: { close: 'Dismiss' } },
      slots: {
        default: () => h(BiliDialog, { modelValue: true, title: '标题' }, () => '内容')
      }
    })
    await nextTick()

    expect(document.querySelector('.bili-dialog__close')?.getAttribute('aria-label')).toBe(
      'Dismiss'
    )
    document.body.innerHTML = ''
  })

  it('formats locale placeholders', () => {
    expect(formatLocale('共 {total} 条', { total: 20 })).toBe('共 20 条')
    expect(formatLocale('Hello {name}', {})).toBe('Hello {name}')
  })
})
