import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import BiliUI from 'bili-ui'
import '../../../packages/bili-ui/src/styles/index.scss'
import './custom.css'
import DemoBlock from './components/DemoBlock.vue'
import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(BiliUI)
    app.component('DemoBlock', DemoBlock)
  }
} satisfies Theme
