import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Bili UI',
  description: '为 Vue 3 打造的高质量 PC 组件库',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Bili UI',
    nav: [
      { text: '指南', link: '/guide/quickstart' },
      { text: '组件', link: '/components/button' },
      { text: '动效', link: '/guide/motion' },
      { text: '设计', link: '/guide/design' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '主题定制', link: '/guide/theme' },
            { text: '动效规范', link: '/guide/motion' },
            { text: '设计规范', link: '/guide/design' },
            { text: '组件开发计划', link: '/guide/roadmap' }
          ]
        }
      ],
      '/components/': [
        {
          text: '基础',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Space 间距', link: '/components/space' },
            { text: 'Divider 分割线', link: '/components/divider' },
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Avatar 头像', link: '/components/avatar' },
            { text: 'Badge 徽标', link: '/components/badge' },
            { text: 'CodeBlock 代码块', link: '/components/code-block' }
          ]
        },
        {
          text: '布局',
          items: [
            { text: 'Layout 布局', link: '/components/layout' },
            { text: 'Grid 栅格', link: '/components/grid' },
            { text: 'Menu 导航菜单', link: '/components/menu' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' }
          ]
        },
        {
          text: '表单',
          items: [
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Checkbox 多选框', link: '/components/checkbox' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'InputNumber 数字输入', link: '/components/input-number' },
            { text: 'Slider 滑块', link: '/components/slider' },
            { text: 'Upload 上传', link: '/components/upload' },
            { text: 'Form 表单', link: '/components/form' }
          ]
        },
        {
          text: '反馈',
          items: [
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Dialog 对话框', link: '/components/dialog' },
            { text: 'Drawer 抽屉', link: '/components/drawer' },
            { text: 'Alert 警告提示', link: '/components/alert' },
            { text: 'Message 消息提示', link: '/components/message' },
            { text: 'Notification 通知', link: '/components/notification' },
            { text: 'Popover 气泡卡片', link: '/components/popover' },
            { text: 'Loading 加载', link: '/components/loading' }
          ]
        },
        {
          text: '数据',
          items: [
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Chart 图表', link: '/components/chart' },
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Pagination 分页', link: '/components/pagination' },
            { text: 'Progress 进度条', link: '/components/progress' },
            { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
            { text: 'Empty 空状态', link: '/components/empty' },
            { text: 'Steps 步骤条', link: '/components/steps' },
            { text: 'Collapse 折叠面板', link: '/components/collapse' },
            { text: 'Descriptions 描述列表', link: '/components/descriptions' },
            { text: 'Result 结果页', link: '/components/result' }
          ]
        }
      ]
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到亮色模式',
    darkModeSwitchTitle: '切换到暗色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    footer: {
      message: '基于 MIT License 发布',
      copyright: 'Copyright © 2026 Bili UI'
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    resolve: {
      alias: {
        'bili-ui': fileURLToPath(
          new URL('../../packages/bili-ui/src/index.ts', import.meta.url)
        )
      }
    }
  }
})
