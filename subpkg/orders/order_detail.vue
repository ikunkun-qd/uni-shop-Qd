<template>
  <view v-if="order" class="order-detail-page">
    <view class="status-banner">
      <view class="status-title">{{order.status}}</view>
      <view class="status-desc">{{statusDescription}}</view>
    </view>

    <view class="detail-card address-card">
      <view class="card-title">收货信息</view>
      <view class="address-user">{{order.address.userName}} {{order.address.telNumber}}</view>
      <view class="address-text">{{order.address.fullAddress}}</view>
    </view>

    <view class="detail-card goods-card">
      <view class="card-title">商品信息</view>
      <view v-for="item in order.items" :key="item.goods_id" class="detail-goods">
        <image class="goods-image" :src="item.image || '/static/logo.png'" mode="aspectFill"></image>
        <view class="goods-main">
          <text class="goods-title">{{item.title}}</text>
          <view class="goods-bottom">
            <text class="goods-price">￥{{formatPrice(item.price)}}</text>
            <text class="goods-count">x{{item.count}}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="detail-card amount-card">
      <view class="card-title">费用明细</view>
      <view class="amount-row"><text>商品总价</text><text>￥{{formatPrice(order.subtotal)}}</text></view>
      <view class="amount-row"><text>运费</text><text>￥{{formatPrice(order.shippingFee)}}</text></view>
      <view class="amount-row total-row"><text>实付金额</text><text>￥{{formatPrice(order.paymentAmount)}}</text></view>
    </view>

    <view class="detail-card order-info-card">
      <view class="card-title">订单信息</view>
      <view class="info-row"><text>订单编号</text><text>{{order.orderNo}}</text></view>
      <view class="info-row"><text>下单时间</text><text>{{order.createdAt}}</text></view>
      <view class="info-row"><text>支付方式</text><text>{{order.paymentMethod}}</text></view>
    </view>

    <view class="detail-actions">
      <view class="detail-action" @click="goOrderList">返回订单列表</view>
      <view v-if="order.status === '待付款'" class="detail-action primary" @click="payDemo">去支付</view>
    </view>
  </view>

  <view v-else class="detail-empty">订单不存在或已被删除</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/store/order.js'

const orderStore = useOrderStore()
const { orders } = storeToRefs(orderStore)
const orderNo = ref('')
const order = computed(() => orders.value.find(item => item.orderNo === orderNo.value))
const statusDescription = computed(() => {
  if (!order.value) return ''
  const descriptions = {
    '待付款': '请在订单有效期内完成支付',
    '待收货': '商品正在配送中，请耐心等待',
    '退款/退货': '售后申请正在处理中'
  }
  return descriptions[order.value.status] || '订单已完成'
})

function formatPrice(price) {
  return Number(price).toFixed(2)
}

function goOrderList() {
  uni.navigateTo({
    url: '/subpkg/orders/orders?status=' + encodeURIComponent(order.value.status)
  })
}

function payDemo() {
  orderStore.markPaid(order.value.orderNo)
  uni.showToast({ title: '支付成功（演示）', icon: 'success' })
}

onLoad((options) => {
  orderNo.value = options && options.orderNo ? decodeURIComponent(options.orderNo) : ''
})
</script>

<style lang="scss">
.order-detail-page{
  min-height: 100vh;
  padding-bottom: 70px;
  background-color: $shop-bg;
}
.status-banner{
  margin: 24rpx;
  padding: 28rpx 24rpx;
  border: 1px solid rgba(93, 127, 164, .18);
  border-radius: $shop-radius;
  color: $shop-text;
  background: $shop-soft;
  .status-title{
    font-size: 21px;
    font-weight: bold;
  }
  .status-desc{
    margin-top: 8px;
      color: $shop-muted;
    font-size: 12px;
  }
}
.detail-card{
  margin: 0 24rpx 18rpx;
  padding: 22rpx;
  border: 1px solid $shop-border;
  border-radius: $shop-radius;
  background-color: $shop-surface;
  box-shadow: $shop-shadow;
  .card-title{
    margin-bottom: 12px;
    color: $shop-text;
    font-size: 15px;
    font-weight: bold;
  }
}
.address-card{
  .address-user{
    color: $shop-text;
    font-size: 14px;
  }
  .address-text{
    margin-top: 8px;
    color: $shop-muted;
    font-size: 12px;
    line-height: 18px;
  }
}
.detail-goods{
  display: flex;
  padding: 10px 0;
  border-top: 1px solid $shop-border;
  .goods-image{
    width: 78px;
    height: 78px;
    border-radius: 4px;
      background-color: $shop-soft;
  }
  .goods-main{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 0 4px 10px;
    .goods-title{
      color: $shop-text;
      font-size: 13px;
      line-height: 20px;
    }
    .goods-bottom{
      display: flex;
      justify-content: space-between;
      .goods-price{
        color: $shop-accent;
        font-size: 15px;
      }
      .goods-count{
        color: #999;
        font-size: 12px;
      }
    }
  }
}
.amount-row,
.info-row{
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  color: #666;
  font-size: 13px;
}
.total-row{
  margin-top: 5px;
  padding-top: 12px;
  border-top: 1px solid $shop-border;
  color: $shop-text;
  font-weight: bold;
  text:last-child{
    color: $shop-accent;
    font-size: 18px;
  }
}
.order-info-card{
    .info-row text:last-child{
    color: $shop-text;
  }
}
.detail-actions{
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 12px;
  background-color: $shop-surface;
  box-shadow: 0 -10rpx 28rpx rgba(28,42,58,.08);
  .detail-action{
    min-width: 100px;
    height: 34px;
    padding: 0 12px;
      border: 1px solid $shop-border;
      border-radius: 12px;
      color: $shop-text;
    font-size: 13px;
    line-height: 34px;
    text-align: center;
    box-sizing: border-box;
    &.primary{
      color: white;
      border-color: $shop-primary;
      background-color: $shop-primary;
    }
  }
}
.detail-empty{
  padding-top: 150px;
  color: $shop-muted;
  font-size: 14px;
  text-align: center;
}
</style>
