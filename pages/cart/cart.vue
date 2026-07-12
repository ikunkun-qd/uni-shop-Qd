<template>
  <!-- 购物车商品显示区域 -->
  <view v-if="token && cart.length !== 0" class="cart-container">
    <!-- 收货地址组件 -->
    <my-address></my-address>
    
     <!-- 购物车商品列表的标题区域 -->
    <view class="cart-title">
      <text class="cart-title-text">购物车 <text class="cart-count">({{cart.length}})</text></text>
      <text class="cart-manage" @click="manageCart">管理</text>
    </view>
    
    <!-- 商品列表区域 -->
    <uni-swipe-action>
      <view class="my-goods" v-for="(item, i) in cart" :key=i>
        <uni-swipe-action-item :right-options="options" @click="swipeItemHandle(item)">
          <my-goods @countChange="countChangeHandle" @radioChange="radioChangeHandle" :item="item" :showRadios="true" :showCount="true"></my-goods>
        </uni-swipe-action-item>
      </view>
    </uni-swipe-action>

    <view class="cart-recommend">
      <view class="recommend-head">
        <text>为你推荐</text>
        <text class="recommend-more">今日精选</text>
      </view>
      <view class="recommend-grid">
        <view class="recommend-card" v-for="item in recommendGoods" :key="item.goods_id" @click="gotoGoods(item)">
          <image :src="item.image" mode="aspectFit"></image>
          <text class="recommend-name">{{item.name}}</text>
          <text class="recommend-price">￥{{item.price}}</text>
        </view>
      </view>
    </view>
    
    <!-- 结算区域 -->
    <my-settle></my-settle>
  </view>

  <!-- 购物车空白区域 -->
  <view v-else-if="token" class="empty-cart">
    <image class="empty-image" src="../../static/cart_empty@2x.png"></image>
    <text class="empty-text">空空如也~</text>
  </view>

  <view v-else class="auth-required">
    <uni-icons type="locked" size="28" color="#5D7FA4"></uni-icons>
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
      backgroundColor: '#5D7FA4'
  }
}]

const recommendGoods = [
  { goods_id: 3, name: '保湿修护精华水', price: 169, image: '/static/user-data/earbuds.jpg' },
  { goods_id: 5, name: '夏日防晒霜', price: 129, image: '/static/user-data/lamp.jpg' },
  { goods_id: 6, name: '家居香氛蜡烛', price: 99, image: '/static/user-data/pot.jpg' },
  { goods_id: 7, name: '纯棉毛巾套装', price: 79, image: '/static/user-data/pillow.jpg' }
]

function radioChangeHandle(message) {
  cartStore.updateGoodsState(message)
}

function countChangeHandle(message) {
  cartStore.updateGoodsCount(message)
}

function swipeItemHandle(item) {
  cartStore.removeGoods(item)
}

function gotoGoods(item) {
  uni.navigateTo({
    url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
  })
}

function manageCart() {
  uni.showToast({ title: '已进入购物车管理模式', icon: 'none' })
}

onShow(() => {
  requireLogin('/pages/cart/cart')
})
useTabbarBadge()
</script>

<style lang="scss">
.cart-container{
  min-height: 100vh;
  padding: 24rpx 24rpx 150rpx;
  background: $shop-bg;
}
.cart-title{
  display: flex;
  height: 52px;
  font-size: 16px;
  align-items: center;
  padding: 0 20rpx;
  margin-top: 18rpx;
  border: 1px solid $shop-border;
  border-bottom: 0;
  border-radius: $shop-radius $shop-radius 0 0;
  background: $shop-surface;
  justify-content: space-between;
  .cart-title-text{
    color: $shop-text;
    font-weight: 600;
    .cart-count{
      color: $shop-muted;
      font-weight: 400;
    }
  }
  .cart-manage{
    color: $shop-muted;
    font-size: 12px;
  }
}
.cart-recommend{
  margin-top: 28rpx;
  padding: 22rpx 18rpx 18rpx;
  border: 1px solid $shop-border;
  border-radius: $shop-radius;
  background: $shop-surface;
  .recommend-head{
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $shop-text;
    font-size: 14px;
    font-weight: 600;
    .recommend-more{
      color: $shop-muted;
      font-size: 11px;
      font-weight: 400;
    }
  }
  .recommend-grid{
    display: flex;
    justify-content: space-between;
    gap: 10rpx;
    margin-top: 16rpx;
  }
  .recommend-card{
    flex: 1;
    min-width: 0;
    .recommend-name{
      display: block;
      overflow: hidden;
      margin-top: 8rpx;
      color: $shop-text;
      font-size: 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .recommend-price{
      display: block;
      margin-top: 6rpx;
      color: $shop-primary-dark;
      font-size: 12px;
    }
    image{
      width: 100%;
      height: 126rpx;
      border-radius: 10rpx;
      background: $shop-soft;
    }
  }
}
.empty-cart{
  min-height: 80vh;
  background: $shop-bg;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .empty-image{
    width: 90px;
    height: 90px;
    padding-top: 140px;
  }
  .empty-text{
    margin-top: 10px;
    color: $shop-muted;
    font-size: 13px;
  }
}
.auth-required{
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16rpx;
  background: $shop-bg;
  height: 300px;
  color: $shop-muted;
  font-size: 14px;
}
</style>
