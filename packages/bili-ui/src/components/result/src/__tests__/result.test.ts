import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Result from '../result.vue'

describe('BiliResult', () => {
  it('renders the title, subtitle and status modifier', () => {
    const wrapper = mount(Result, {
      props: { status: 'success', title: '提交成功', subTitle: '我们将在 1 个工作日内处理' }
    })

    expect(wrapper.classes()).toContain('bili-result--success')
    expect(wrapper.find('.bili-result__title').text()).toBe('提交成功')
    expect(wrapper.find('.bili-result__subtitle').text()).toContain('1 个工作日')
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('maps statuses to semantic tones', () => {
    expect(mount(Result, { props: { status: 'error' } }).classes()).toContain('bili-result--tone-danger')
    expect(mount(Result, { props: { status: 'warning' } }).classes()).toContain('bili-result--tone-warning')
    expect(mount(Result, { props: { status: 'success' } }).classes()).toContain('bili-result--tone-success')
    expect(mount(Result, { props: { status: 'info' } }).classes()).toContain('bili-result--tone-primary')
  })

  it('renders code-style statuses for error pages', () => {
    const wrapper = mount(Result, { props: { status: '404', title: '页面不存在' } })

    expect(wrapper.find('.bili-result__code').text()).toBe('404')
    expect(wrapper.find('.bili-result__svg').exists()).toBe(false)
    expect(wrapper.classes()).toContain('bili-result--tone-primary')
  })

  it('renders an svg icon for non-code statuses', () => {
    const wrapper = mount(Result, { props: { status: 'warning' } })
    expect(wrapper.find('.bili-result__svg').exists()).toBe(true)
  })

  it('renders the icon, title and extra slots', () => {
    const wrapper = mount(Result, {
      slots: {
        icon: '<span class="custom-icon" />',
        title: '<h2 class="custom-title">标题</h2>',
        subTitle: '<p class="custom-sub">副标题</p>',
        default: '<button class="action">返回首页</button>'
      }
    })

    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-title').text()).toBe('标题')
    expect(wrapper.find('.custom-sub').text()).toBe('副标题')
    expect(wrapper.find('.bili-result__extra .action').text()).toBe('返回首页')
  })
})
