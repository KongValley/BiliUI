<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ThemeColorPicker from './components/ThemeColorPicker.vue'
import HomeShowcase from './components/HomeShowcase.vue'
import StudioShowcase from './components/StudioShowcase.vue'
import HomeContent from './components/HomeContent.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-before>
      <section class="home-hero" aria-labelledby="home-hero-title">
        <div class="home-hero__inner">
          <HomeShowcase />
          <StudioShowcase />
        </div>
      </section>
    </template>
    <template #home-features-after><HomeContent /></template>
    <template #nav-bar-content-after>
      <ThemeColorPicker />
    </template>
  </Layout>
</template>
