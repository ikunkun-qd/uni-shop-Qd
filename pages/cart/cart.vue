<template>
  <!-- 购物车商品显示区域 -->
  <view v-if="token && cart.length !== 0" class="cart-container">
    <!-- 收货地址组件 -->
    <my-address></my-address>
    
     <!-- 购物车商品列表的标题区域 -->
    <view class="cart-title">
      <uni-icons type="shop" size="30"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>
    
    <!-- 商品列表区域 -->
    <uni-swipe-action>
      <view class="my-goods" v-for="(item, i) in cart" :key=i>
        <uni-swipe-action-item :right-options="options" @click="swipeItemHandle(item)">
          <my-goods @countChange="countChangeHandle" @radioChange="radioChangeHandle" :item="item" :showRadios="true" :showCount="true"></my-goods>
        </uni-swipe-action-item>
      </view>
    </uni-swipe-action>
    
    <!-- 结算区域 -->
    <my-settle></my-settle>
  </view>

  <!-- 购物车空白区域 -->
  <view v-else-if="token" class="empty-cart">
    <image class="empty-image" src="../../static/cart_empty@2x.png"></image>
    <text class="empty-text">空空如也~</text>
  </view>

  <view v-else class="auth-required">
    <text>请先登录后查看购物车</text>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart.js'
import { useUserStore } from '@/store/user.js'
import { useAuth } from '@/composables/use-auth.js'
import { useTabbarBadge } from '@/composables/use-tabbar-badge.js'

const cartStore = useCartStore()
const userStore = useUserStore()
const { cart } = storeToRefs(cartStore)
const { token } = storeToRefs(userStore)
const { requireLogin } = useAuth()
const options = [{
  text: '删除',
  style: {
    backgroundColor: '#2f766d'
  }
}]

function radioChangeHandle(message) {
  cartStore.updateGoodsState(message)
}

function countChangeHandle(message) {
  cartStore.updateGoodsCount(message)
}

function swipeItemHandle(item) {
  cartStore.removeGoods(item)
}

onShow(() => {
  requireLogin('/pages/cart/cart')
})
useTabbarBadge()
</script>

<style lang="scss">
.cart-container{
  padding: 12rpx 12rpx 132rpx;
}
.cart-title{
  display: flex;
  height: 48px;
  font-size: 14px;
  align-items: center;
  padding: 0 10px;
  margin-top: 8rpx;
  border-radius: 16rpx 16rpx 0 0;
  background: #ffffff;
  border-bottom: 1px solid #e8eeeb;
  .cart-title-text{
    margin-left: 8px;
    color: #1f2a2a;
    font-weight: 600;
  }
}
.empty-cart{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .empty-image{
    width: 90px;
    height: 90px;
    padding-top: 180px;
  }
  .empty-text{
    margin-top: 10px;
    font-size: 13px;
  }
}
.auth-required{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #8a9694;
  font-size: 14px;
}
</style>
