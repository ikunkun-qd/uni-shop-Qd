<template>
  <view>
    <!-- 选择收货地址按钮 -->
    <view v-if="!hasAddress" class="address-chose-box">
      <button type="primary" size="mini" @click="choseAddress">请选择收货地址+</button>
    </view>
    
    <!-- 渲染收货信息的盒子 -->
    <view v-else class="address-info-box" @click="choseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：{{address.userName}}</view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：{{address.telNumber}}</view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      
      <view class="row2">
        <view class="row2-left">
          <view>收货地址：</view>
        </view>
        <view class="row2-right">
          {{addStr}}
        </view>
      </view>
    </view>
    
    <!-- 底部边框线 -->
    <image src="../../static/cart_border@2x.png" class="address-boder"></image>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()
const { address, addStr } = storeToRefs(userStore)
const hasAddress = computed(() => Boolean(
  address.value &&
  address.value.userName &&
  address.value.telNumber &&
  addStr.value
))

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
.address-boder{
  width: 100%;
  height: 5px;
  display: block;
}
.address-chose-box{
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.address-info-box{
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;
  .row1{
    display: flex;
    justify-content: space-between;

    .row1-right{
      display: flex;
      justify-content: space-between;
    }
  }
  .row2{
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-top: 10px;
  }
}
</style>
