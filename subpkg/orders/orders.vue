<template>
  <view class="order-page">
    <view class="order-tabs">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['order-tab', { active: activeStatus === tab }]"
        @click="changeStatus(tab)"
      >
        <text>{{tab}}</text>
        <text v-if="tabCount(tab)" class="tab-count">{{tabCount(tab)}}</text>
      </view>
    </view>

    <scroll-view class="order-list" scroll-y>
      <view v-if="filteredOrders.length" class="order-list-content">
        <view v-for="order in filteredOrders" :key="order.orderNo" class="order-card" @click="openDetail(order)">
          <view class="order-card-header">
            <text class="order-no">订单号：{{order.orderNo}}</text>
            <text class="order-status">{{order.status}}</text>
          </view>
          <view class="order-time">下单时间：{{order.createdAt}}</view>

          <view v-for="item in order.items" :key="item.goods_id" class="order-goods">
            <image class="goods-image" :src="item.image || '/static/logo.png'" mode="aspectFill"></image>
            <view class="goods-content">
              <text class="goods-title">{{item.title}}</text>
              <view class="goods-price-row">
                <text class="goods-price">￥{{formatPrice(item.price)}}</text>
                <text class="goods-count">x{{item.count}}</text>
              </view>
            </view>
          </view>

          <view class="order-summary">
            <text>共{{totalCount(order)}}件商品</text>
            <text>实付 <text class="payment-amount">￥{{formatPrice(order.paymentAmount)}}</text></text>
          </view>

          <view v-if="order.status === '待付款' || order.status === '待收货'" class="order-actions">
            <view v-if="order.status === '待付款'" class="order-action primary" @click.stop="payDemo(order)">去支付</view>
            <view v-else-if="order.status === '待收货'" class="order-action" @click.stop="openDetail(order)">查看物流</view>
          </view>
        </view>
      </view>

      <view v-else class="empty-orders">
        <image src="/static/cart_empty@2x.png" class="empty-image"></image>
        <text class="empty-title">暂无{{activeStatus}}</text>
        <text class="empty-desc">去逛逛，挑选一些喜欢的商品吧</text>
        <view class="go-home" @click="goHome">去首页逛逛</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name:'order-list',
    data(){
      return {
        tabs:['全部订单', '待付款', '待收货', '退款/退货'],
        activeStatus:'全部订单'
      }
    },
    computed:{
      ...mapState('m_order', ['orders']),
      filteredOrders(){
        if(this.activeStatus === '全部订单') return this.orders
        return this.orders.filter(order => order.status === this.activeStatus)
      }
    },
    onLoad(options){
      const status = options && options.status ? decodeURIComponent(options.status) : '全部订单'
      if(this.tabs.indexOf(status) !== -1) this.activeStatus = status
    },
    methods:{
      tabCount(tab){
        if(tab === '全部订单') return this.orders.length
        return this.orders.filter(order => order.status === tab).length
      },
      changeStatus(status){
        this.activeStatus = status
      },
      formatPrice(price){
        return Number(price).toFixed(2)
      },
      totalCount(order){
        return order.items.reduce((total, item) => total + item.count, 0)
      },
      openDetail(order){
        uni.navigateTo({
          url:'/subpkg/orders/order_detail?orderNo=' + encodeURIComponent(order.orderNo)
        })
      },
      payDemo(order){
        this.$store.commit('m_order/markPaid', order.orderNo)
        uni.showToast({
          title:'支付成功（演示）',
          icon:'success'
        })
      },
      goHome(){
        uni.switchTab({
          url:'/pages/home/home'
        })
      }
    }
  }
</script>

<style lang="scss">
.order-page{
  min-height: 100vh;
  background-color: #f5f5f5;
}
.order-tabs{
  position: sticky;
  top: 0;
  z-index: 2;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: white;
  border-bottom: 1px solid #eeeeee;
  .order-tab{
    position: relative;
    height: 46px;
    line-height: 46px;
    color: #666;
    font-size: 13px;
    &.active{
      color: #c00000;
      font-weight: bold;
      &::after{
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 28px;
        height: 3px;
        border-radius: 3px;
        background-color: #c00000;
        transform: translateX(-50%);
      }
    }
  }
  .tab-count{
    margin-left: 3px;
    color: #c00000;
    font-size: 11px;
  }
}
.order-list{
  height: calc(100vh - 46px);
}
.order-list-content{
  padding: 10px;
}
.order-card{
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
  &:active{
    background-color: #fafafa;
  }
  .order-card-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .order-no{
      color: #555;
      font-size: 12px;
    }
    .order-status{
      color: #c00000;
      font-size: 13px;
    }
  }
  .order-time{
    padding: 8px 0;
    color: #999;
    font-size: 11px;
    border-bottom: 1px solid #f5f5f5;
  }
  .order-goods{
    display: flex;
    padding: 12px 0 4px;
    .goods-image{
      width: 72px;
      height: 72px;
      flex-shrink: 0;
      border-radius: 4px;
      background-color: #f8f8f8;
    }
    .goods-content{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
      padding: 3px 0 3px 10px;
      .goods-title{
        overflow: hidden;
        color: #333;
        font-size: 13px;
        line-height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .goods-price-row{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-price{
          color: #c00000;
          font-size: 14px;
        }
        .goods-count{
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
  .order-summary{
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    color: #666;
    font-size: 12px;
    border-top: 1px solid #f5f5f5;
    .payment-amount{
      color: #c00000;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .order-actions{
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    .order-action{
      min-width: 72px;
      height: 28px;
      padding: 0 10px;
      border: 1px solid #dddddd;
      border-radius: 15px;
      color: #555;
      font-size: 12px;
      line-height: 28px;
      text-align: center;
      box-sizing: border-box;
      &.primary{
        color: white;
        border-color: #c00000;
        background-color: #c00000;
      }
    }
  }
}
.empty-orders{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  .empty-image{
    width: 100px;
    height: 100px;
  }
  .empty-title{
    margin-top: 15px;
    color: #555;
    font-size: 15px;
  }
  .empty-desc{
    margin-top: 8px;
    color: #999;
    font-size: 12px;
  }
  .go-home{
    margin-top: 20px;
    width: 120px;
    height: 34px;
    border-radius: 17px;
    color: white;
    background-color: #c00000;
    font-size: 13px;
    line-height: 34px;
    text-align: center;
  }
}
</style>
