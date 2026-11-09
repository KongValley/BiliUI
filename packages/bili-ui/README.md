# Bili UI

A modern Vue 3 PC component library with TypeScript, Sass design tokens and dark mode.

## Install

```bash
pnpm add bili-ui vue
```

## Usage

```ts
import { createApp } from 'vue'
import BiliUI from 'bili-ui'
import 'bili-ui/style.css'
import App from './App.vue'

createApp(App).use(BiliUI).mount('#app')
```

Or import components on demand:

```ts
import { BiliButton, BiliInput } from 'bili-ui'
```

## Links

- Documentation: run `pnpm dev` in the repository root
- Source: `packages/bili-ui/src`
- License: MIT
