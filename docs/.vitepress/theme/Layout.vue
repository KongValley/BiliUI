<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ThemeColorPicker from './components/ThemeColorPicker.vue'
import HomeShowcase from './components/HomeShowcase.vue'
import StudioShowcase from './components/StudioShowcase.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-info><HomeShowcase /></template>
    <template #home-hero-image><StudioShowcase /></template>
    <template #nav-bar-content-after>
      <ThemeColorPicker />
    </template>
  </Layout>
</template>
