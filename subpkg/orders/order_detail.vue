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

<script>
  import { mapState } from 'vuex';
  export default {
    name:'order-detail',
    data(){
      return {
        orderNo:''
      }
    },
    computed:{
      ...mapState('m_order', ['orders']),
      order(){
        return this.orders.find(item => item.orderNo === this.orderNo)
      },
      statusDescription(){
        if(!this.order) return ''
        const descriptions = {
          '待付款':'请在订单有效期内完成支付',
          '待收货':'商品正在配送中，请耐心等待',
          '退款/退货':'售后申请正在处理中'
        }
        return descriptions[this.order.status] || '订单已完成'
      }
    },
    onLoad(options){
      this.orderNo = options && options.orderNo ? decodeURIComponent(options.orderNo) : ''
    },
    methods:{
      formatPrice(price){
        return Number(price).toFixed(2)
      },
      goOrderList(){
        uni.navigateTo({
          url:'/subpkg/orders/orders?status=' + encodeURIComponent(this.order.status)
        })
      },
      payDemo(){
        this.$store.commit('m_order/markPaid', this.order.orderNo)
        uni.showToast({
          title:'支付成功（演示）',
          icon:'success'
        })
      },
    }
  }
</script>

<style lang="scss">
.order-detail-page{
  min-height: 100vh;
  padding-bottom: 70px;
  background-color: #f5f5f5;
}
.status-banner{
  padding: 20px 15px;
  color: white;
  background: linear-gradient(135deg, #d73535, #c00000);
  .status-title{
    font-size: 21px;
    font-weight: bold;
  }
  .status-desc{
    margin-top: 8px;
    color: rgba(255,255,255,.85);
    font-size: 12px;
  }
}
.detail-card{
  margin: 10px;
  padding: 14px;
  border-radius: 6px;
  background-color: white;
  .card-title{
    margin-bottom: 12px;
    color: #333;
    font-size: 15px;
    font-weight: bold;
  }
}
.address-card{
  .address-user{
    color: #333;
    font-size: 14px;
  }
  .address-text{
    margin-top: 8px;
    color: #666;
    font-size: 12px;
    line-height: 18px;
  }
}
.detail-goods{
  display: flex;
  padding: 10px 0;
  border-top: 1px solid #f3f3f3;
  .goods-image{
    width: 78px;
    height: 78px;
    border-radius: 4px;
    background-color: #f8f8f8;
  }
  .goods-main{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 0 4px 10px;
    .goods-title{
      color: #333;
      font-size: 13px;
      line-height: 20px;
    }
    .goods-bottom{
      display: flex;
      justify-content: space-between;
      .goods-price{
        color: #c00000;
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
  border-top: 1px solid #f3f3f3;
  color: #333;
  font-weight: bold;
  text:last-child{
    color: #c00000;
    font-size: 18px;
  }
}
.order-info-card{
  .info-row text:last-child{
    color: #333;
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
  background-color: white;
  box-shadow: 0 -1px 5px rgba(0,0,0,.05);
  .detail-action{
    min-width: 100px;
    height: 34px;
    padding: 0 12px;
    border: 1px solid #dddddd;
    border-radius: 18px;
    color: #555;
    font-size: 13px;
    line-height: 34px;
    text-align: center;
    box-sizing: border-box;
    &.primary{
      color: white;
      border-color: #c00000;
      background-color: #c00000;
    }
  }
}
.detail-empty{
  padding-top: 150px;
  color: #999;
  font-size: 14px;
  text-align: center;
}
</style>
