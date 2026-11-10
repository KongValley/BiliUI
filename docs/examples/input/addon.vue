<script setup lang="ts">
import { ref } from 'vue'

const site = ref('bili-ui')
const price = ref('99')
</script>

<template>
  <BiliSpace direction="vertical" size="lg" style="width: 420px">
    <BiliInput v-model="site" placeholder="站点名称">
      <template #prepend>https://</template>
      <template #append>.com</template>
    </BiliInput>

    <BiliInput v-model="price" placeholder="价格">
      <template #prepend>¥</template>
      <template #append>元</template>
    </BiliInput>
  </BiliSpace>
</template>
