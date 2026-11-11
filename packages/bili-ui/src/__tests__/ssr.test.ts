import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ConfigProvider from '../components/config-provider/src/config-provider.vue'
import Button from '../components/button/src/button.vue'
import Select from '../components/select/src/select.vue'
import Table from '../components/table/src/table.vue'
import DatePicker from '../components/date-picker/src/date-picker.vue'
import Segmented from '../components/segmented/src/segmented.vue'
import AutoComplete from '../components/auto-complete/src/auto-complete.vue'
import Mention from '../components/mention/src/mention.vue'
import VirtualList from '../components/virtual-list/src/virtual-list.vue'
import Text from '../components/typography/src/text.vue'
import Title from '../components/typography/src/title.vue'

const columns = [{ label: '名称', prop: 'name' }]
const data = [{ name: 'Bili UI' }]

describe('SSR smoke', () => {
  it('renders a representative component tree without a DOM', async () => {
    const App = {
      render: () =>
        h(ConfigProvider, { namespace: 'bili-ssr', locale: { close: 'Close' } }, () =>
          h('main', [
            h(Title, { level: 2 }, () => 'Bili UI'),
            h(Text, { type: 'secondary' }, () => 'SSR smoke'),
            h(Button, { type: 'primary' }, () => '提交'),
            h(Select, { options: [{ label: 'A', value: 'a' }] }),
            h(Table, { columns, data, rowKey: 'name' }),
            h(DatePicker, { modelValue: '2026-11-11' }),
            h(Segmented, {
              modelValue: 'a',
              options: [
                { label: 'A', value: 'a' },
                { label: 'B', value: 'b' }
              ]
            }),
            h(AutoComplete, { options: ['Alpha'] }),
            h(Mention, { options: [{ label: 'Alice', value: 'alice' }] }),
            h(VirtualList, { data: ['one', 'two'], height: 100, itemHeight: 20 })
          ])
        )
    }

    const html = await renderToString(createSSRApp(App))

    expect(html).toContain('Bili UI')
    expect(html).toContain('SSR smoke')
    expect(html).toContain('提交')
    expect(html).toContain('bili-ssr-table')
    expect(html).toContain('bili-ssr-segmented')
    expect(html).toContain('bili-ssr-virtual-list')
    expect(html).toContain('bili-ssr-button')
  })

  it('renders an overlay component in its closed state', async () => {
    const Dialog = (await import('../components/dialog/src/dialog.vue')).default
    const Drawer = (await import('../components/drawer/src/drawer.vue')).default
    const html = await renderToString(
      createSSRApp({
        render: () => h('div', [h(Dialog, { modelValue: false }), h(Drawer, { modelValue: false })])
      })
    )
    expect(html).toContain('teleport start')
    expect(html).not.toContain('bili-dialog__overlay')
  })
})
