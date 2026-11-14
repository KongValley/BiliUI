<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  defaultThemeColor,
  getThemeColor,
  resetThemeColor,
  setThemeColor,
  themeColorPresets
} from 'bili-ui'

const STORAGE_KEY = 'bili-ui-theme-color'
const current = ref(getThemeColor())

const apply = (color: string) => {
  if (setThemeColor(color)) current.value = getThemeColor()
}

const persist = (color: string) => {
  apply(color)
  try {
    localStorage.setItem(STORAGE_KEY, color)
  } catch {
    // Private browsing or storage disabled; the in-memory theme still applies.
  }
}

const handleCustom = (event: Event) => {
  persist((event.target as HTMLInputElement).value)
}

const reset = () => {
  resetThemeColor()
  current.value = defaultThemeColor
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) apply(saved)
  } catch {
    // Ignore storage failures.
  }
})
</script>

<template>
  <BiliPopover
    trigger="click"
    placement="bottom-end"
    :width="232"
    :offset="10"
    popper-class="theme-color-popper"
  >
    <template #content>
      <div class="theme-color-panel">
        <div class="theme-color-panel__head">
          <span>主题色</span>
          <code>{{ current }}</code>
        </div>

        <div class="theme-color-swatches" role="group" aria-label="主题色预设">
          <button
            v-for="preset in themeColorPresets"
            :key="preset.color"
            type="button"
            class="theme-color-swatch"
            :class="{ 'is-active': current === preset.color }"
            :aria-label="preset.name"
            :aria-pressed="current === preset.color"
            :title="preset.name"
            @click="persist(preset.color)"
          >
            <span
              class="theme-color-swatch__fill"
              :style="{ backgroundColor: preset.color }"
            />
            <span v-if="current === preset.color" class="theme-color-swatch__check">✓</span>
          </button>
        </div>

        <label class="theme-color-custom">
          <span>自定义颜色</span>
          <input type="color" :value="current" aria-label="自定义主题色" @input="handleCustom" />
        </label>

        <button type="button" class="theme-color-reset" @click="reset">
          恢复品牌默认色
        </button>
      </div>
    </template>

    <button
      type="button"
      class="theme-color-trigger"
      title="主题色"
      aria-label="设置主题色"
    >
      <span class="theme-color-trigger__swatch" :style="{ backgroundColor: current }" />
    </button>
  </BiliPopover>
</template>

<style scoped>
.theme-color-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 4px;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 50%;
  transition: background-color 0.2s var(--bili-transition-function);
}

.theme-color-trigger:hover {
  background-color: var(--vp-c-default-soft);
}

.theme-color-trigger:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.theme-color-trigger__swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 2px rgb(255 255 255 / 82%),
    0 0 0 1px var(--vp-c-divider);
}

.theme-color-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.theme-color-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.theme-color-panel__head code {
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.theme-color-swatches {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.theme-color-swatch {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  padding: 4px;
  cursor: pointer;
  background: transparent;
  border: 1.5px solid transparent;
  border-radius: 50%;
  transition:
    border-color 0.2s var(--bili-transition-function),
    transform 0.2s var(--bili-transition-function-spring);
}

.theme-color-swatch:hover {
  transform: scale(1.08);
}

.theme-color-swatch.is-active {
  border-color: var(--vp-c-text-1);
}

.theme-color-swatch:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.theme-color-swatch__fill {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 8%);
}

.theme-color-swatch__check {
  position: absolute;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgb(0 0 0 / 45%);
  pointer-events: none;
}

.theme-color-custom {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 10px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  border-top: 1px solid var(--vp-c-divider);
}

.theme-color-custom span {
  flex: 1;
}

.theme-color-custom input {
  width: 28px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.theme-color-reset {
  padding: 4px 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  transition: color 0.2s var(--bili-transition-function);
}

.theme-color-reset:hover {
  color: var(--vp-c-brand-1);
}
</style>
