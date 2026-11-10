<script setup lang="ts">
import { enUSLocale } from 'bili-ui'

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' }
]
</script>

<template>
  <BiliConfigProvider :locale="enUSLocale">
    <BiliSpace direction="vertical" :size="16">
      <BiliSpace align="center" wrap :size="12">
        <BiliButton type="primary">Primary</BiliButton>
        <BiliInput placeholder="Type here" style="width: 180px" />
        <BiliSelect :options="options" style="width: 160px" />
      </BiliSpace>

      <BiliPagination
        :total="60"
        :page-size="10"
        :current-page="1"
        layout="total, prev, pager, next, jumper"
      />

      <BiliEmpty description="No records yet" />
    </BiliSpace>
  </BiliConfigProvider>
</template>
