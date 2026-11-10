<template>
  <BiliSpace :size="24" wrap align="start">
    <BiliQRCode value="https://bili-ui.dev" />
    <BiliQRCode
      value="https://bili-ui.dev/components/qrcode"
      :size="120"
      color="#e0356b"
      :margin="1"
    />
    <BiliQRCode value="Bili UI · QRCode" :size="120" background="#f7f8fa" />
  </BiliSpace>
</template>
