<template>
  <view>
    <!-- 登录组件 -->
    <my-login v-if="!token" ></my-login>
    
    <!-- 用户信息组件 -->
    <my-userInfo v-else class="my-container"></my-userInfo>
    
  </view>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user.js'
import { useTabbarBadge } from '@/composables/use-tabbar-badge.js'

const userStore = useUserStore()
const { token } = storeToRefs(userStore)
useTabbarBadge()
</script>

<style lang="scss">
.my-container{
  height: 100%;
}
</style>
