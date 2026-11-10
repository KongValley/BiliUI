import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Upload from '../upload.vue'
import type { UploadFile } from '../upload'

const makeFile = (name = 'doc.txt', type = 'text/plain') =>
  new File(['content'], name, { type })

describe('BiliUpload', () => {
  it('renders the trigger button by default', () => {
    const wrapper = mount(Upload)
    expect(wrapper.find('.bili-upload__dragger').exists()).toBe(false)
    expect(wrapper.text()).toContain('选择文件')
  })

  it('renders the dragger when drag is enabled', () => {
    const wrapper = mount(Upload, { props: { drag: true, tip: '支持任意格式' } })

    expect(wrapper.find('.bili-upload__dragger').exists()).toBe(true)
    expect(wrapper.text()).toContain('点击或拖拽文件到此区域上传')
    expect(wrapper.find('.bili-upload__tip').text()).toBe('支持任意格式')
  })

  it('auto-uploads dropped files and reports success', async () => {
    const wrapper = mount(Upload, {
      props: {
        drag: true,
        httpRequest: async ({ onProgress }: { onProgress: (n: number) => void }) => {
          onProgress(100)
          return '/files/doc.txt'
        }
      }
    })

    await wrapper.find('.bili-upload__dragger').trigger('drop', {
      dataTransfer: { files: [makeFile()] }
    })
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:fileList')?.length).toBeGreaterThan(0)
    expect(wrapper.emitted('success')).toHaveLength(1)
    const file = wrapper.emitted('success')?.[0]?.[0] as UploadFile
    expect(file.status).toBe('success')
    expect(file.percent).toBe(100)
  })

  it('keeps files in ready state when autoUpload is off', async () => {
    const wrapper = mount(Upload, {
      props: { drag: true, autoUpload: false },
      attachTo: document.body
    })

    await wrapper.find('.bili-upload__dragger').trigger('drop', {
      dataTransfer: { files: [makeFile()] }
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.emitted('success')).toBeUndefined()
    expect(wrapper.findAll('.bili-upload__item')).toHaveLength(1)
    wrapper.unmount()
  })

  it('rejects files when beforeUpload returns false', async () => {
    const wrapper = mount(Upload, {
      props: { drag: true, beforeUpload: () => false }
    })

    await wrapper.find('.bili-upload__dragger').trigger('drop', {
      dataTransfer: { files: [makeFile()] }
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.findAll('.bili-upload__item')).toHaveLength(0)
  })

  it('emits exceed when the limit is reached', async () => {
    const wrapper = mount(Upload, {
      props: { drag: true, limit: 1, autoUpload: false }
    })

    await wrapper.find('.bili-upload__dragger').trigger('drop', {
      dataTransfer: { files: [makeFile('a.txt')] }
    })
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    await wrapper.find('.bili-upload__dragger').trigger('drop', {
      dataTransfer: { files: [makeFile('b.txt')] }
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.emitted('exceed')).toHaveLength(1)
    wrapper.unmount()
  })

  it('marks a file as errored when the request rejects', async () => {
    const wrapper = mount(Upload, {
      props: {
        drag: true,
        httpRequest: async () => {
          throw new Error('网络错误')
        }
      },
      attachTo: document.body
    })

    await wrapper.find('.bili-upload__dragger').trigger('drop', {
      dataTransfer: { files: [makeFile()] }
    })
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('error')?.[0]?.[1]).toBe('网络错误')
    expect(wrapper.find('.bili-upload__error').text()).toBe('网络错误')
    expect(wrapper.find('.bili-upload__action').exists()).toBe(true)
    wrapper.unmount()
  })

  it('removes a file from the list', async () => {
    const files: UploadFile[] = [
      {
        uid: 'a',
        name: 'a.txt',
        size: 10,
        type: 'text/plain',
        status: 'success',
        percent: 100
      }
    ]
    const wrapper = mount(Upload, { props: { fileList: files } })

    await wrapper.find('.bili-upload__action').trigger('click')
    expect(wrapper.emitted('remove')?.[0]?.[0]).toMatchObject({ uid: 'a' })
  })

  it('toggles the dragover highlight', async () => {
    const wrapper = mount(Upload, { props: { drag: true } })
    const dragger = wrapper.find('.bili-upload__dragger')

    await dragger.trigger('dragover')
    expect(dragger.classes()).toContain('is-dragover')

    await dragger.trigger('dragleave')
    expect(dragger.classes()).not.toContain('is-dragover')
  })

  it('formats file sizes', () => {
    const wrapper = mount(Upload, {
      props: {
        fileList: [
          { uid: '1', name: 'a', size: 512, type: 'text/plain', status: 'success', percent: 100 },
          {
            uid: '2',
            name: 'b',
            size: 2048,
            type: 'text/plain',
            status: 'success',
            percent: 100
          },
          {
            uid: '3',
            name: 'c',
            size: 3 * 1024 * 1024,
            type: 'text/plain',
            status: 'success',
            percent: 100
          }
        ]
      }
    })

    const sizes = wrapper.findAll('.bili-upload__size').map(node => node.text())
    expect(sizes).toEqual(['512 B', '2.0 KB', '3.0 MB'])
  })
})
