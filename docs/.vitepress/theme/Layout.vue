<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ThemeColorPicker from './components/ThemeColorPicker.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <ThemeColorPicker />
    </template>
  </Layout>
</template>
