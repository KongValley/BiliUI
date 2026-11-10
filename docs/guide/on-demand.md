# 按需样式

Bili UI 提供两种样式引入方式：**全量样式**和**按组件样式**。

## 全量样式

```ts
import { createApp } from 'vue'
import BiliUI from 'bili-ui'
import 'bili-ui/style.css'

createApp(App).use(BiliUI).mount('#app')
```

## 按组件样式

只引入实际使用的组件样式：

```ts
import { BiliButton, BiliSelect } from 'bili-ui'
import 'bili-ui/components/button/style.css'
import 'bili-ui/components/select/style.css'
```

`bili-ui/es/components/button/style.css` 与 `bili-ui/components/button/style.css` 等价，方便兼容不同的路径约定。

每个组件样式文件会包含：

- 设计令牌（`:root` 语义变量与暗色主题覆盖）
- 基础样式（盒模型、字体、动画关键帧）
- 组件自身样式
- 组件依赖的样式，例如 Select 会包含 Checkbox / Icon 等依赖

因此按需引入单个组件样式后即可独立渲染，不需要额外引入 `style.css`。

## 组件名与路径

路径中的组件名使用**目录名**：

| 组件           | 路径                                       |
| -------------- | ------------------------------------------ |
| Button         | `bili-ui/components/button/style.css`      |
| DatePicker     | `bili-ui/components/date-picker/style.css` |
| TimePicker     | `bili-ui/components/time-picker/style.css` |
| TreeSelect     | `bili-ui/components/tree-select/style.css` |
| ConfigProvider | 无独立视觉样式，可不引入                   |

## 注意

- 按组件样式已经包含基础令牌；不要再同时引入 `bili-ui/style.css`，否则会重复加载。
- 样式文件通过 `package.json` 的 `exports` 暴露，Vite、Webpack、Rollup 等支持 package exports 的构建工具可直接解析。
- 如果业务使用 CDN / 非打包环境，可以直接引用 `dist/components/<component>/style.css`。
- 按需样式只解决 CSS 体积；JavaScript 仍然从 `bili-ui` 主入口按需导入组件。
