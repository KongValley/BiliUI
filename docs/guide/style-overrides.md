# 样式覆写

Bili UI 的样式由 **语义变量 → 组件变量 → BEM 选择器** 三层组成。优先改变量；变量覆盖不到的结构再写选择器。

## 1. 全局换肤

所有组件共享 `src/styles/var.scss` 中的语义变量。变量可以写在 `:root`，也可以写在任意业务容器上：

```css
.my-app {
  --bili-color-primary: #1677ff;
  --bili-color-primary-hover: #4096ff;
  --bili-radius-base: 2px;
}
```

完整语义令牌见 [主题定制](/guide/theme)。

## 2. 组件变量

大部分组件在根节点暴露 `--bili-<component>-*` 变量，优先覆盖它们：

```css
/* 只影响这个卡片 */
.my-card {
  --bili-card-radius: 4px;
  --bili-card-padding: 20px;
  --bili-card-shadow: var(--bili-shadow-md);
}

/* 只影响业务容器里的按钮 */
.my-app .bili-button {
  --bili-button-height: 36px;
  --bili-button-radius: 2px;
  --bili-button-hover-bg: #eef4ff;
}
```

### 常用组件变量

| 组件         | 变量                                                                                                                                                                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button       | `--bili-button-height`、`--bili-button-padding`、`--bili-button-radius`、`--bili-button-color`、`--bili-button-bg`、`--bili-button-border`、`--bili-button-hover-*`、`--bili-button-active-*`                                                             |
| Input        | `--bili-input-height`、`--bili-input-padding`、`--bili-input-radius`、`--bili-input-bg`、`--bili-input-border-color`、`--bili-input-hover-border-color`、`--bili-input-focus-border-color`、`--bili-input-focus-shadow`、`--bili-input-placeholder-color` |
| Select       | `--bili-select-height`、`--bili-select-padding`、`--bili-select-radius`、`--bili-select-bg`、`--bili-select-border-color`、`--bili-select-hover-border-color`、`--bili-select-focus-border-color`                                                         |
| Checkbox     | `--bili-checkbox-size`、`--bili-checkbox-radius`、`--bili-checkbox-bg`、`--bili-checkbox-border-color`、`--bili-checkbox-checked-bg`、`--bili-checkbox-check-color`                                                                                       |
| Radio        | `--bili-radio-size`、`--bili-radio-bg`、`--bili-radio-border-color`、`--bili-radio-checked-color`、`--bili-radio-dot-color`                                                                                                                               |
| Switch       | `--bili-switch-width`、`--bili-switch-height`、`--bili-switch-on-bg`、`--bili-switch-on-hover-bg`、`--bili-switch-off-bg`、`--bili-switch-action-bg`                                                                                                      |
| Slider       | `--bili-slider-rail-height`、`--bili-slider-handle-size`、`--bili-slider-rail-color`、`--bili-slider-fill-color`、`--bili-slider-handle-bg`、`--bili-slider-handle-border-color`                                                                          |
| Tag          | `--bili-tag-padding`、`--bili-tag-radius`、`--bili-tag-color`、`--bili-tag-bg`、`--bili-tag-border`                                                                                                                                                       |
| Card         | `--bili-card-padding`、`--bili-card-radius`、`--bili-card-bg`、`--bili-card-shadow`                                                                                                                                                                       |
| Table        | `--bili-table-cell-padding`、`--bili-table-border-color`、`--bili-table-head-bg`、`--bili-table-head-color`、`--bili-table-row-hover-bg`、`--bili-table-striped-bg`、`--bili-table-selected-bg`                                                           |
| Pagination   | `--bili-pagination-item-size`、`--bili-pagination-item-radius`、`--bili-pagination-item-hover-bg`、`--bili-pagination-item-active-bg`、`--bili-pagination-item-active-color`、`--bili-pagination-item-solid-bg`                                           |
| Tabs         | `--bili-tabs-gap`、`--bili-tabs-height`、`--bili-tabs-tab-color`、`--bili-tabs-active-color`、`--bili-tabs-indicator-color`、`--bili-tabs-card-bg`、`--bili-tabs-segment-bg`                                                                              |
| Timeline     | `--bili-timeline-item-gap`、`--bili-timeline-dot-size`、`--bili-timeline-line-color`、`--bili-timeline-timestamp-color`、`--bili-timeline-content-color`                                                                                                  |
| Steps        | `--bili-step-icon-size`、`--bili-step-active-color`、`--bili-step-error-color`、`--bili-step-line-color`、`--bili-step-title-color`、`--bili-step-description-color`                                                                                      |
| Rate         | `--bili-rate-font-size`、`--bili-rate-color`、`--bili-rate-void-color`、`--bili-rate-text-color`                                                                                                                                                          |
| Alert        | `--bili-alert-padding`、`--bili-alert-radius`、`--bili-alert-bg`、`--bili-alert-border`、`--bili-alert-text-color`、`--bili-alert-color`                                                                                                                  |
| Message      | `--bili-message-padding`、`--bili-message-radius`、`--bili-message-bg`、`--bili-message-border-color`、`--bili-message-shadow`                                                                                                                            |
| Notification | `--bili-notification-padding`、`--bili-notification-radius`、`--bili-notification-bg`、`--bili-notification-border-color`、`--bili-notification-shadow`                                                                                                   |
| BackTop      | `--bili-back-top-size`、`--bili-back-top-bg`、`--bili-back-top-hover-bg`、`--bili-back-top-radius`                                                                                                                                                        |
| Carousel     | `--bili-carousel-bg`、`--bili-carousel-radius`、`--bili-carousel-arrow-bg`、`--bili-carousel-indicator-bg`、`--bili-carousel-indicator-active-bg`                                                                                                         |
| QRCode       | `--bili-qrcode-radius`、`--bili-qrcode-empty-bg`、`--bili-qrcode-empty-border-color`                                                                                                                                                                      |
| Watermark    | `--bili-watermark-opacity`                                                                                                                                                                                                                                |

## 3. Teleport 浮层

Tooltip、Popover、Select 面板、Dropdown 菜单、Menu 弹出层、Dialog / Drawer 遮罩都挂载到 `body`。**写在触发器根节点上的变量不会继承过去**，需要直接写到浮层元素上：

| 浮层                 | 选择器                                       |
| -------------------- | -------------------------------------------- |
| Tooltip              | `.bili-tooltip__content`                     |
| Popover / Popconfirm | `.bili-popover__content`                     |
| Dropdown             | `.bili-dropdown__popup`                      |
| Select               | `.bili-select__panel`                        |
| Cascader             | `.bili-cascader__panel`                      |
| ColorPicker          | `.bili-color-picker__panel`                  |
| TreeSelect           | `.bili-tree-select__panel`                   |
| Menu / SubMenu       | `.bili-menu__panel`、`.bili-sub-menu__popup` |
| Dialog 遮罩          | `.bili-dialog__overlay`                      |
| Drawer 遮罩          | `.bili-drawer__overlay`                      |
| Tour                 | `.bili-tour` 或 `.bili-tour__popover`        |

```css
/* 深色业务里的下拉面板 */
.bili-dropdown__popup {
  --bili-dropdown-bg: #1b1e23;
  --bili-dropdown-border-color: #343b4c;
  --bili-dropdown-item-hover-bg: #2b3140;
}

/* 自定义 Select 选项选中态 */
.bili-select__panel {
  --bili-select-option-selected-bg: #eef4ff;
  --bili-select-option-selected-color: #1677ff;
}
```

Dialog / Drawer 的面板变量写在 `.bili-dialog` / `.bili-drawer`，遮罩变量写在 `__overlay`：

```css
.bili-dialog {
  --bili-dialog-radius: 8px;
  --bili-dialog-header-padding: 16px 20px 8px;
}

.bili-dialog__overlay {
  --bili-dialog-overlay-bg: rgb(0 0 0 / 55%);
}
```

## 4. 多实例主题隔离

浮层组件支持传入额外类名，把变量挂到具体实例的浮层上：

```html
<BiliTooltip popper-class="billing-tooltip">...</BiliTooltip>
<BiliSelect popper-class="billing-select" :options="options" />
<BiliDialog panel-class="billing-dialog" overlay-class="billing-dialog-mask" />
<BiliImage preview-class="billing-preview" :preview-src-list="urls" />
```

```css
.billing-tooltip {
  --bili-tooltip-bg: #111827;
}

.billing-select {
  --bili-select-option-selected-bg: #eef4ff;
  --bili-select-option-selected-color: #1677ff;
}

.billing-dialog {
  --bili-dialog-radius: 4px;
}

.billing-dialog-mask {
  --bili-dialog-overlay-bg: rgb(0 0 0 / 60%);
}

.billing-preview {
  --bili-image-viewer-bg: rgb(0 0 0 / 90%);
}
```

| 组件                                         | 类名属性                       |
| -------------------------------------------- | ------------------------------ |
| Tooltip / Popover / Popconfirm               | `popper-class`                 |
| Select / Cascader / ColorPicker / TreeSelect | `popper-class`                 |
| Dropdown / Menu                              | `popper-class`                 |
| Tour                                         | `popper-class`                 |
| Dialog / Drawer                              | `overlay-class`、`panel-class` |
| Image                                        | `preview-class`                |

- `Menu` 的 `popper-class` 会应用到溢出面板和所有子菜单浮层。
- `Popconfirm` 继承 `Popover` 的 `popper-class`。
- 这些类名会落在 Teleport 后的真实浮层元素上，因此可以安全地按实例隔离变量。

## 5. 选择器覆写

组件使用稳定的 BEM 类名，没有哈希和 Shadow DOM。变量覆盖不到的结构可以直接写选择器，注意权重和加载顺序：

```css
/* 与库样式同权重，业务 CSS 在库 CSS 之后加载即可生效 */
.bili-button--primary {
  font-weight: 600;
}

/* 交互态权重更高，用业务容器或同等权重覆盖 */
.my-app .bili-button:hover:not(:disabled) {
  background-color: #eef4ff;
}

/* 内部元素 */
.bili-table__cell {
  border-bottom-color: #e5e8ec;
}
```

常用类名规则：

- 组件根：`.bili-<component>`
- 元素：`.bili-<component>__<element>`
- 形态：`.bili-<component>--<modifier>`、`.bili-button--primary`
- 状态：`.is-active`、`.is-disabled`、`.is-open`、`.is-selected`

## 6. 动态尺寸与位置

BackTop、Affix、Watermark、QRCode 的动态值会写入 CSS 变量，再由样式表消费，因此可以直接覆盖属性，不需要 `!important`：

| 组件      | 动态变量                                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| BackTop   | `--bili-back-top-right`、`--bili-back-top-bottom`、`--bili-back-top-z-index`                                                        |
| Affix     | `--bili-affix-top`、`--bili-affix-bottom`、`--bili-affix-left`、`--bili-affix-width`、`--bili-affix-height`、`--bili-affix-z-index` |
| Watermark | `--bili-watermark-image`、`--bili-watermark-size`、`--bili-watermark-position`、`--bili-watermark-z-index`                          |
| QRCode    | `--bili-qrcode-size`                                                                                                                |

> 这些变量由 props 写入内联样式，同名 CSS 变量无法覆盖内联值；请直接覆盖对应的 CSS 属性（如上例），或使用 props。

```css
/* BackTop：覆盖悬浮位置 */
.bili-back-top {
  right: 24px;
  bottom: 24px;
}

/* Affix：覆盖固定后的尺寸/位置（注意会改变吸顶行为） */
.bili-affix__content.is-fixed {
  width: 200px;
  top: 96px;
}

/* Watermark：覆盖纹理与平铺尺寸 */
.bili-watermark__overlay {
  background-image: url('/custom-watermark.svg');
  background-size: 160px 80px;
}

/* QRCode：覆盖二维码尺寸 */
.bili-qrcode {
  width: 200px;
  height: 200px;
}
```

其余仍由 props 写入内联样式的属性：

| 组件     | 内联属性                             | 推荐方式                        |
| -------- | ------------------------------------ | ------------------------------- |
| Image    | `width`、`height`                    | 使用 props                      |
| Dialog   | `width`、`margin-top`                | 使用 `width` / `top` props      |
| Drawer   | 宽高、方向                           | 使用 `size` / `direction` props |
| 浮层组件 | `position`、`left`、`top`、`z-index` | 运行时定位，通常不覆盖          |

如果确实要用 CSS 覆盖上表中的运行时定位属性，需要 `!important`。

## 7. 注意

- 组件变量默认值引用语义令牌，因此修改 `--bili-color-primary` 等全局变量时，组件会同步变化。
- 少量列表重置（分页、菜单、面包屑、图表图例）使用了 `!important`，修改 `padding` / `margin` / `list-style` 时需要同等权重。
- 浮层内的变量需要写在浮层元素上；多实例主题优先使用 `popper-class` / `panel-class` / `overlay-class` / `preview-class`。
