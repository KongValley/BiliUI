<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BiliIcon } from '@kongvalley/bili-ui'

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const copyInstall = async () => {
  const command = 'pnpm add @kongvalley/bili-ui'

  try {
    await navigator.clipboard.writeText(command)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = command
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }

  copied.value = true
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copied.value = false
  }, 1800)
}

onBeforeUnmount(() => clearTimeout(copyTimer))
</script>

<template>
  <div class="home-showcase">
    <div class="home-eyebrow">
      <span class="home-eyebrow__mark" aria-hidden="true" />
      <span>Bili UI</span>
      <span class="home-eyebrow__divider" aria-hidden="true" />
      <span>Vue 3 component system</span>
    </div>

    <h1 id="home-hero-title">
      把界面做简单，<br />
      <span>把体验做讲究。</span>
    </h1>

    <p class="home-hero__description">
      一套为中文产品打造的 Vue 3 组件系统。克制的视觉、完整的类型、可组合的 API，
      让设计稿更快成为经得起推敲的产品。
    </p>

    <div class="home-actions">
      <a class="home-action home-action--primary" href="/guide/quickstart">
        开始使用
        <span aria-hidden="true">→</span>
      </a>
      <a class="home-action home-action--secondary" href="/components/button">
        <BiliIcon name="grid" :size="15" />
        浏览组件
      </a>
    </div>

    <div class="home-install">
      <span class="home-install__label">从一行命令开始</span>
      <div class="home-command">
        <code><span>$</span> pnpm add @kongvalley/bili-ui</code>
        <button
          type="button"
          class="home-command__copy"
          :aria-label="copied ? '安装命令已复制' : '复制安装命令'"
          :title="copied ? '已复制' : '复制命令'"
          @click="copyInstall"
        >
          <BiliIcon :name="copied ? 'check' : 'copy'" :size="14" />
        </button>
      </div>
    </div>

    <dl class="home-metrics">
      <div class="home-metric">
        <dt>组件</dt>
        <dd><strong>115</strong><span>个</span></dd>
      </div>
      <div class="home-metric">
        <dt>令牌层级</dt>
        <dd><strong>03</strong><span>层</span></dd>
      </div>
      <div class="home-metric">
        <dt>内置主题</dt>
        <dd><strong>02</strong><span>套</span></dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
.home-showcase {
  width: 100%;
  max-width: 500px;
}

.home-eyebrow {
  display: inline-flex;
  gap: 9px;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  margin-bottom: 28px;
  font-family: var(--bili-font-family-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.035em;
  color: var(--bili-text-secondary);
  background: var(--bili-fill-color-lighter);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 999px;
}

.home-eyebrow__mark {
  width: 6px;
  height: 6px;
  background: var(--bili-color-primary);
  border-radius: 2px;
  transform: rotate(45deg);
}

.home-eyebrow__divider {
  width: 1px;
  height: 10px;
  background: var(--bili-border-color);
}

h1 {
  margin: 0;
  font-size: clamp(44px, 4.25vw, 64px);
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: -0.055em;
  color: var(--bili-text-primary);
}

h1 span {
  color: var(--bili-color-primary);
}

.home-hero__description {
  max-width: 460px;
  margin: 24px 0 0;
  font-size: 15px;
  line-height: 1.9;
  color: var(--bili-text-secondary);
}

.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 30px;
}

.home-action {
  display: inline-flex;
  gap: 9px;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 17px;
  font-size: 13px;
  font-weight: 500;
  color: var(--bili-text-primary);
  text-decoration: none;
  border: 1px solid var(--bili-border-color);
  border-radius: 7px;
  transition:
    color var(--bili-transition-duration),
    background-color var(--bili-transition-duration),
    border-color var(--bili-transition-duration);
}

.home-action--primary {
  color: var(--bili-color-on-primary);
  background: var(--bili-color-primary);
  border-color: var(--bili-color-primary);
}

.home-action--primary:hover {
  color: var(--bili-color-on-primary);
  background: var(--bili-color-primary-hover);
  border-color: var(--bili-color-primary-hover);
}

.home-action--primary span {
  font-size: 16px;
  line-height: 1;
  transition: transform var(--bili-transition-duration);
}

.home-action--primary:hover span {
  transform: translateX(2px);
}

.home-action--secondary:hover {
  color: var(--bili-color-primary);
  background: var(--bili-color-primary-light);
  border-color: color-mix(in srgb, var(--bili-color-primary) 36%, var(--bili-border-color));
}

.home-install {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-top: 22px;
}

.home-install__label {
  font-size: 11px;
  color: var(--bili-text-placeholder);
}

.home-command {
  display: inline-flex;
  align-items: center;
  height: 32px;
  overflow: hidden;
  background: var(--bili-fill-color-lighter);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 6px;
}

.home-command code {
  padding: 0 0 0 10px;
  font-family: var(--bili-font-family-mono);
  font-size: 11px;
  color: var(--bili-text-regular);
}

.home-command code span {
  margin-right: 5px;
  color: var(--bili-color-primary);
}

.home-command__copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 30px;
  margin-left: 8px;
  padding: 0;
  color: var(--bili-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-left: 1px solid var(--bili-border-color-light);
}

.home-command__copy:hover {
  color: var(--bili-color-primary);
  background: var(--bili-fill-color-light);
}

.home-command__copy:focus-visible {
  outline-offset: -3px;
}

.home-metrics {
  display: flex;
  gap: 0;
  margin: 34px 0 0;
  padding-top: 20px;
  border-top: 1px solid var(--bili-border-color-lighter);
}

.home-metric {
  min-width: 112px;
  padding-right: 28px;
  margin-right: 28px;
  border-right: 1px solid var(--bili-border-color-lighter);
}

.home-metric:last-child {
  padding-right: 0;
  margin-right: 0;
  border-right: 0;
}

.home-metric dt {
  font-size: 10px;
  line-height: 1.4;
  color: var(--bili-text-placeholder);
}

.home-metric dd {
  display: flex;
  gap: 5px;
  align-items: baseline;
  margin: 3px 0 0;
}

.home-metric strong {
  font-family: var(--bili-font-family-mono);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--bili-text-primary);
  letter-spacing: -0.04em;
}

.home-metric dd span {
  font-size: 10px;
  color: var(--bili-text-secondary);
}

@media (max-width: 959px) {
  .home-showcase {
    max-width: 660px;
  }

  h1 {
    font-size: 52px;
  }

  .home-hero__description {
    max-width: 560px;
    font-size: 14px;
  }
}

@media (max-width: 640px) {
  .home-eyebrow {
    margin-bottom: 20px;
  }

  h1 {
    font-size: 42px;
    line-height: 1.2;
  }

  .home-hero__description {
    margin-top: 20px;
    font-size: 13px;
    line-height: 1.85;
  }

  .home-actions {
    margin-top: 24px;
  }

  .home-action {
    height: 38px;
  }

  .home-install {
    gap: 7px;
    margin-top: 18px;
  }

  .home-install__label {
    width: 100%;
  }

  .home-metrics {
    margin-top: 28px;
  }

  .home-metric {
    flex: 1;
    min-width: 0;
    padding-right: 14px;
    margin-right: 14px;
  }

  .home-metric strong {
    font-size: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-action,
  .home-action--primary span {
    transition: none;
  }
}
</style>
