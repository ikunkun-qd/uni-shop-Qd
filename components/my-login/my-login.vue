<template>
  <view class="login-container">
    <image class="login-avatar" src="/static/demo-bear-avatar.png"></image>
    <button type="primary" class="login-btn" @click="demoLogin">一键登录</button>
    <text class="login-text">登录后尽享更多权益</text>
  </view>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()
const { redirectInfo } = storeToRefs(userStore)

function demoLogin() {
  userStore.updateUserinfo({
    avatarUrl: '/static/demo-bear-avatar.png',
    nickName: '演示用户'
  })
  userStore.updateToken('demo-token')

  if (redirectInfo.value && redirectInfo.value.openType === 'switchTab') {
    const redirectUrl = redirectInfo.value.from
    userStore.updateRedirectInfo(null)
    uni.switchTab({ url: redirectUrl })
    return
  }

  uni.showToast({
    title: '登录成功',
    icon: 'success'
  })
}
</script>

<style lang="scss">
.login-container{
  min-height: 78vh;
  padding: 72rpx 48rpx;
  background-color: $shop-bg;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .login-avatar{
    width: 132rpx;
    height: 132rpx;
    border-radius: 50%;
    margin-bottom: 36rpx;
    border: 8rpx solid $shop-surface;
    box-shadow: 0 16rpx 36rpx rgba(93, 127, 164, .18);
  }
  .login-btn{
    margin: 10px 0;
    width: 100%;
    border-radius: 14px;
    color: $shop-surface;
    background-color: $shop-primary;
    box-shadow: 0 10rpx 20rpx rgba(93, 127, 164, .18);
  }
  .login-text{
    font-size: 12px;
    color: $shop-muted;
  }
}
</style>
