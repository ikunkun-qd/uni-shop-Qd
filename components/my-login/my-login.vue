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
  height: 750rpx;
  padding: 48rpx 28rpx;
  background-color: #f7f8f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .login-avatar{
    width: 100px;
    height: 100px;
    border-radius: 50px;
    margin-bottom: 20px;
  }
  .login-btn{
    margin: 10px 0;
    width: 90%;
    border-radius: 100px;
    background-color: #2f766d;
  }
  .login-text{
    font-size: 12px;
    color: gray;
  }
}
</style>
