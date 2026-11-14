<script setup lang="ts">
import HomeMark from './HomeMark.vue'
</script>

<template>
  <div class="home-showcase">
    <div class="home-hero">
      <div class="home-hero__copy">
        <span class="home-eyebrow"><span class="home-eyebrow__dot" />Bili UI · Vue 3 Component Library</span>
        <h1 id="home-hero-title">让好设计，<br /><span>成为默认。</span></h1>
        <p class="home-hero__description">
          115 个精心打磨的组件，一套完整的视觉语言。<br class="home-description-break" />
          为有想法的产品，留更多创造的空间。
        </p>
      </div>
      <HomeMark />
    </div>
    <div class="home-install">
      <code><span>pnpm</span> add bili-ui</code>
      <a href="/guide/quickstart">从一行命令开始 <span aria-hidden="true">↗</span></a>
    </div>
  </div>
</template>

<style scoped>
.home-showcase {
  width: 100%;
}

.home-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-hero__copy {
  min-width: 0;
}

.home-eyebrow {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 26px;
  font-family: var(--bili-font-family-mono);
  font-size: 10px;
  letter-spacing: 0.045em;
  color: var(--bili-text-secondary);
}

.home-eyebrow__dot {
  width: 5px;
  height: 5px;
  background: var(--bili-color-primary);
  border-radius: 50%;
}

.home-hero h1 {
  margin: 0;
  font-size: clamp(42px, 4.3vw, 64px);
  font-weight: 600;
  line-height: 1.24;
  letter-spacing: -0.045em;
  color: var(--bili-text-primary);
}

.home-hero h1 span {
  color: var(--bili-color-primary);
}

.home-hero__description {
  margin: 26px 0 0;
  font-size: 14px;
  line-height: 1.85;
  color: var(--bili-text-secondary);
}

.home-install {
  display: flex;
  gap: 22px;
  align-items: center;
  margin: 32px 0 0;
  font-size: 11px;
  color: var(--bili-text-secondary);
}

.home-install code {
  padding: 7px 11px;
  font-family: var(--bili-font-family-mono);
  font-size: 11px;
  color: var(--bili-text-primary);
  background: var(--bili-fill-color-lighter);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 6px;
}

.home-install code span {
  margin-right: 3px;
  color: var(--bili-text-secondary);
}

.home-install a {
  color: var(--bili-text-regular);
  text-decoration: none;
}

.home-install a:hover {
  color: var(--bili-color-primary);
}

.home-hero h1 {
  white-space: normal;
}

.home-hero__copy {
  max-width: 100%;
}

.home-description-break {
  display: none;
}

@media (max-width: 1120px) {
  .home-showcase {
    padding-top: 24px;
  }

  .home-hero h1 {
    font-size: 48px;
  }

  .home-hero__description {
    font-size: 13px;
  }
}

@media (max-width: 640px) {
  .home-hero__copy {
    max-width: 100%;
  }

  .home-hero h1 {
    font-size: 44px;
  }

  .home-hero__description {
    max-width: 270px;
  }

  .home-hero__copy {
    flex: 1;
  }

  .home-eyebrow {
    margin-bottom: 18px;
    font-size: 9px;
  }

  .home-hero__description {
    margin-top: 20px;
  }

  .home-install {
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 28px;
  }
}
</style>
