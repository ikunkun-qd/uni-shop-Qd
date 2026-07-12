<template>
  <view>
    <view class="address-info-box" @click="choseAddress">
      <uni-icons type="location" size="22" color="#5D7FA4"></uni-icons>
      <view class="address-copy">
        <text class="address-label">收货地址</text>
        <text class="address-text">{{displayAddress}}</text>
      </view>
      <uni-icons type="arrowright" size="16" color="#8793A2"></uni-icons>
    </view>
    
    <!-- 底部边框线 -->
    <view class="address-rule"></view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()
const { addStr } = storeToRefs(userStore)
const displayAddress = computed(() => addStr.value || '广东省广州市天河区体育西路 123 号')

async function choseAddress() {
  try {
    const result = await uni.chooseAddress()
    const err = Array.isArray(result) ? result[0] : null
    const succ = Array.isArray(result) ? result[1] : result
    if (!err && succ && succ.errMsg === 'chooseAddress:ok') {
      userStore.updateAddress(succ)
    }
  } catch (error) {
    const errorMessage = error && error.errMsg ? error.errMsg : ''
    if (errorMessage.indexOf('cancel') === -1) {
      uni.$showMsg('收货地址选择失败，请重试')
    }
  }
}
</script>

<style lang="scss">
.address-rule{
  width: 100%;
  height: 3px;
  display: block;
  background: repeating-linear-gradient(135deg, $shop-primary 0 8rpx, transparent 8rpx 16rpx);
  opacity: .38;
}
.address-info-box{
  display: flex;
  align-items: center;
  min-height: 82px;
  display: flex;
  gap: 16rpx;
  padding: 0 20rpx;
  background: $shop-surface;
  border: 1px solid $shop-border;
  border-radius: $shop-radius;
  .address-copy{
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .address-label{
    color: $shop-text;
    font-size: 13px;
    font-weight: 600;
  }
  .address-text{
    overflow: hidden;
    margin-top: 8rpx;
    color: $shop-muted;
    font-size: 11px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
