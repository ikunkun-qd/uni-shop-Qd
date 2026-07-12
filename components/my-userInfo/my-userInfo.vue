<template>
  <view class="my-userinfo-container">
    <!-- 头像昵称区域 -->
    <view class="top-box" @click="showProfile">
      <view class="profile-main">
        <image :src="userinfo.avatarUrl || '/static/demo-bear-avatar.png'" class="avatar"></image>
        <view class="profile-copy">
          <view class="nickname">我的</view>
          <view class="profile-hint">{{userinfo.nickName || '欢迎回来'}}</view>
        </view>
      </view>
      <uni-icons type="arrowright" size="18" color="#5D7FA4"></uni-icons>
    </view>

    <view class="pannel-list">
      <!-- 用户数据 -->
      <view class="pannel">
        <view class="pannel-body">
          <view
            class="pannel-item stat-item"
            v-for="(item, index) in userStats"
            :key="index"
            @click="openUserData(item.type)"
          >
            <text class="stat-number">{{item.value}}</text>
            <text>{{item.label}}</text>
          </view>
        </view>
      </view>

      <!-- 订单数据 -->
      <view class="pannel">
        <view class="pannel-title-row">
          <text class="pannel-title">我的订单</text>
          <text class="title-more" @click="openOrders('全部订单')">查看全部</text>
        </view>
        <view class="pannel-body">
          <view
            class="pannel-item order-item"
            v-for="(item, index) in orderStats"
            :key="index"
            @click="openOrders(item.targetStatus || item.status)"
          >
            <view class="order-icon-box">
              <uni-icons :type="item.icon" size="24" color="#5D7FA4"></uni-icons>
              <text v-if="item.count" class="order-badge">{{item.count}}</text>
            </view>
            <text>{{item.status}}</text>
          </view>
        </view>
      </view>

      <!-- 地址、客服和登录数据 -->
      <view class="pannel">
        <view class="pannel-list-item" @click="chooseAddress">
          <view class="list-item-main">
            <text>收货地址</text>
            <text class="sub-text">{{addressText}}</text>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>

        <view class="pannel-list-item" @click="contactService">
          <view class="list-item-main">
            <text>联系客服</text>
            <text class="sub-text service-status">在线 · 5分钟内响应</text>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>

        <view class="pannel-list-item" @click="logout">
          <view class="list-item-main">
            <text>退出登录</text>
            <text class="sub-text">退出当前演示账号</text>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>

        <view class="pannel-list-item" @click="openSettings">
          <view class="list-item-main">
            <text>设置</text>
            <text class="sub-text">通知与账号偏好</text>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user.js'
import { useOrderStore } from '@/store/order.js'
import { useUserDataStore } from '@/store/user-data.js'

const userStore = useUserStore()
const orderStore = useOrderStore()
const userDataStore = useUserDataStore()
const { userinfo, address } = storeToRefs(userStore)
const { orderCounts } = storeToRefs(orderStore)
const { counts } = storeToRefs(userDataStore)
const mockAddress = {
  userName: '张同学',
  telNumber: '138****8888',
  provinceName: '广东省',
  cityName: '深圳市',
  countyName: '南山区',
  detailInfo: '科技园演示路 18 号'
}

const userStats = computed(() => [
  { type: 'shops', label: '收藏的店铺', value: counts.value.shops },
  { type: 'favoriteGoods', label: '收藏的商品', value: counts.value.favoriteGoods },
  { type: 'followedGoods', label: '关注的商品', value: counts.value.followedGoods },
  { type: 'footprints', label: '足迹', value: counts.value.footprints }
])

const orderStats = computed(() => [
  { status: '待付款', count: orderCounts.value['待付款'], icon: 'wallet' },
  { status: '待收货', targetStatus: '待收货', count: orderCounts.value['待收货'], icon: 'paperplane' },
  { status: '退款/售后', targetStatus: '退款/退货', count: orderCounts.value['退款/退货'], icon: 'refreshempty' },
  { status: '退货/退款', targetStatus: '退款/退货', count: orderCounts.value['退款/退货'], icon: 'close' },
  { status: '全部订单', targetStatus: '全部订单', count: orderCounts.value['全部订单'], icon: 'list' }
])

const addressText = computed(() => {
  const currentAddress = address.value && address.value.userName ? address.value : mockAddress
  return currentAddress.userName + ' · ' + currentAddress.provinceName + currentAddress.cityName + currentAddress.countyName
})

function showProfile() {
  uni.showModal({
    title: userinfo.value.nickName || '演示用户',
    content: '会员等级：黄金会员\n成长值：1280\n本月已省：￥86.50\n账号状态：正常',
    showCancel: false
  })
}

function openUserData(type) {
  navigateToList('/subpkg/user_data/user_data?type=' + encodeURIComponent(type))
}

function openOrders(status) {
  navigateToList('/subpkg/orders/orders?status=' + encodeURIComponent(status))
}

function navigateToList(url) {
  uni.navigateTo({
    url,
    animationType: 'none',
    animationDuration: 0
  })
}

function openSettings() {
  uni.showToast({ title: '设置功能演示中', icon: 'none' })
}

async function chooseAddress() {
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

function contactService() {
  uni.showModal({
    title: '联系客服',
    content: '当前在线，预计 5 分钟内回复。\n演示客服：400-888-8888\n服务时间：09:00-18:00',
    showCancel: false
  })
}

async function logout() {
  try {
    const result = await uni.showModal({
      title: '提示',
      content: '你确定要退出演示账号吗?'
    })
    const succ = Array.isArray(result) ? result[1] : result
    if (succ && succ.confirm) {
      userStore.updateAddress({})
      userStore.updateUserinfo({})
      userStore.updateToken('')
      uni.showToast({ title: '已退出登录', icon: 'success' })
    }
  } catch (error) {
    uni.$showMsg('退出登录失败，请重试')
  }
}
</script>

<style lang="scss">
.my-userinfo-container{
  min-height: 100%;
  background-color: $shop-bg;
  .top-box{
    height: 220rpx;
    padding: 0 30rpx;
    background: #eef4fa;
    border-bottom: 1px solid $shop-border;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
    .profile-main{
      display: flex;
      align-items: center;
    }
    .avatar{
      display: block;
      width: 116rpx;
      height: 116rpx;
      border-radius: 50%;
      box-shadow: 0 12rpx 30rpx rgba(93, 127, 164, .16);
      border: 6rpx solid $shop-soft;
    }
    .profile-copy{
      margin-left: 20rpx;
    }
    .nickname{
      color: $shop-text;
      font-size: 18px;
      font-weight: bold;
    }
    .profile-hint{
      color: $shop-muted;
      font-size: 12px;
      margin-top: 8rpx;
    }
  }
  .pannel-list{
    padding: 0 24rpx;
    position: relative;
    top: -16rpx;
    .pannel{
      background-color: $shop-surface;
      border: 1px solid $shop-border;
      border-radius: $shop-radius;
      margin-bottom: 16rpx;
      overflow: hidden;
    }
    .pannel-body{
      display: flex;
      justify-content: space-around;
      .pannel-item{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        font-size: 13px;
        padding: 12px 0;
        color: $shop-text;
      }
      .pannel-item:active{
        background-color: $shop-soft;
      }
    }
    .stat-number{
      color: $shop-primary-dark;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .pannel-title-row{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid $shop-border;
      padding-right: 12px;
    }
    .pannel-title{
      line-height: 45px;
      padding-left: 10px;
    }
    .title-more{
      color: $shop-muted;
      font-size: 12px;
    }
    .order-icon-box{
      position: relative;
      height: 32px;
      margin-bottom: 2px;
      .order-badge{
        position: absolute;
        top: -5px;
        right: -12px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        padding: 0 3px;
        border-radius: 10px;
      background-color: $shop-accent;
        color: white;
        font-size: 10px;
        text-align: center;
        box-sizing: border-box;
      }
    }
    .pannel-list-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 58px;
      border-bottom: 1px solid $shop-border;
      padding: 0 10px;
      &:last-child{
        border-bottom: 0;
      }
      &:active{
        background-color: $shop-soft;
      }
    }
    .list-item-main{
      display: flex;
      flex-direction: column;
      .sub-text{
        color: $shop-muted;
        font-size: 11px;
        margin-top: 4px;
      }
      .service-status{
        color: $shop-primary;
      }
    }
  }
}
</style>
