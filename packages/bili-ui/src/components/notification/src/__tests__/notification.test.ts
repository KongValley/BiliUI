import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Notification from '../notification.vue'
import { BiliNotification, __resetNotifications } from '../method'

afterEach(() => {
  __resetNotifications()
  document.body.innerHTML = ''
})

describe('BiliNotification', () => {
  it('renders title, message and icon', () => {
    const wrapper = mount(Notification, {
      props: { title: '部署完成', message: '生产环境已更新', type: 'success', duration: 0 }
    })

    expect(wrapper.classes()).toContain('bili-notification--success')
    expect(wrapper.find('.bili-notification__title').text()).toBe('部署完成')
    expect(wrapper.find('.bili-notification__message').text()).toBe('生产环境已更新')
    expect(wrapper.find('.bili-notification__icon').exists()).toBe(true)
  })

  it('emits close then destroy when the close button is clicked', async () => {
    const wrapper = mount(Notification, {
      props: { message: '可关闭', duration: 0 }
    })

    await wrapper.find('.bili-notification__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)

    await new Promise(resolve => setTimeout(resolve, 260))
    expect(wrapper.emitted('destroy')).toHaveLength(1)
  })

  it('auto closes after the duration', async () => {
    const wrapper = mount(Notification, {
      props: { message: '自动关闭', duration: 30 }
    })

    await new Promise(resolve => setTimeout(resolve, 60))
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('renders the progress bar only when duration is set', () => {
    const withBar = mount(Notification, { props: { message: 'a', duration: 100 } })
    expect(withBar.find('.bili-notification__progress').exists()).toBe(true)

    const withoutBar = mount(Notification, { props: { message: 'b', duration: 0 } })
    expect(withoutBar.find('.bili-notification__progress').exists()).toBe(false)
  })

  it('pauses the timer while hovered', async () => {
    const wrapper = mount(Notification, {
      props: { message: '悬停暂停', duration: 40 }
    })

    await wrapper.trigger('mouseenter')
    await new Promise(resolve => setTimeout(resolve, 80))
    expect(wrapper.emitted('close')).toBeUndefined()

    await wrapper.trigger('mouseleave')
    await new Promise(resolve => setTimeout(resolve, 80))
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

describe('BiliNotification method', () => {
  it('mounts into a positioned container and closes', async () => {
    const instance = BiliNotification.success({
      title: '同步成功',
      message: '数据已更新',
      duration: 0
    })
    await nextTick()

    const container = document.body.querySelector('.bili-notification-container--top-right')
    expect(container).not.toBeNull()
    expect(container?.textContent).toContain('同步成功')

    instance.close()
    await new Promise(resolve => setTimeout(resolve, 260))
    expect(document.body.querySelector('.bili-notification')).toBeNull()
  })

  it('honours the position option', async () => {
    BiliNotification.info({ message: '左下角', position: 'bottom-left', duration: 0 })
    await nextTick()

    expect(
      document.body.querySelector('.bili-notification-container--bottom-left')
    ).not.toBeNull()
  })

  it('closeAll removes every notification', async () => {
    BiliNotification.info({ message: 'a', duration: 0 })
    BiliNotification.warning({ message: 'b', duration: 0 })
    await nextTick()

    expect(document.body.querySelectorAll('.bili-notification')).toHaveLength(2)

    BiliNotification.closeAll()
    await new Promise(resolve => setTimeout(resolve, 260))
    expect(document.body.querySelectorAll('.bili-notification')).toHaveLength(0)
  })
})
