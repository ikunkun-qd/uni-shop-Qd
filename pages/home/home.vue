<template>
  <view class="home-page">
    <view class="home-search-row">
      <view class="home-search-flex">
        <my-search bgColor="#F7F9FC" :radius="12" @search="gotoSearch"></my-search>
      </view>
      <uni-icons class="home-notice" type="notification" size="22" color="#1D2B3D" @click="openNotifications"></uni-icons>
    </view>

    <view class="hero-card" @click="gotoGoods(heroGoods)">
      <view class="hero-copy">
        <text class="hero-kicker">NEW SEASON</text>
        <text class="hero-title">夏日焕新</text>
        <text class="hero-subtitle">精选好物　清爽一夏</text>
        <view class="hero-button">立即购买</view>
      </view>
      <image class="hero-image" :src="heroGoods.image" mode="aspectFit"></image>
    </view>
    <view class="hero-dots"><text class="active"></text><text></text><text></text></view>

    <view class="home-nav">
      <view class="home-nav-item" v-for="item in navList" :key="item.label" @click="navClickHandler(item)">
        <view class="nav-round">
          <uni-icons :type="item.icon" size="23" color="#416991"></uni-icons>
        </view>
        <text>{{item.label}}</text>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">精选推荐</text>
      <text class="section-more" @click="navClickHandler({ label: '全部' })">查看全部　›</text>
    </view>
    <view class="featured-grid">
      <view class="featured-card" v-for="item in featuredGoods" :key="item.goods_id" @click="gotoGoods(item)">
        <view class="featured-image-wrap">
          <image :src="item.image" mode="aspectFit"></image>
        </view>
        <text class="featured-name">{{item.name}}</text>
        <text class="featured-desc">{{item.desc}}</text>
        <view class="featured-bottom">
          <text class="featured-price">￥{{formatPrice(item.price)}}</text>
          <uni-icons type="cart" size="18" color="#416991"></uni-icons>
        </view>
      </view>
    </view>

    <view class="promo-section">
      <view class="section-head promo-head">
        <text class="section-title">限时特惠</text>
        <text class="section-more" @click="openPromoList">今日精选　›</text>
      </view>
      <view class="promo-grid">
          <view class="promo-card" v-for="item in promoList" :key="item.title" @click="openPromo(item)">
          <text class="promo-title">{{item.title}}</text>
          <text class="promo-desc">{{item.desc}}</text>
          <view class="promo-link" @click.stop="openPromo(item)">立即查看　›</view>
          <image :src="item.image" mode="aspectFit"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useTabbarBadge } from '@/composables/use-tabbar-badge.js'

const navList = [
  { label: '女装', icon: 'person' },
  { label: '男装', icon: 'staff' },
  { label: '鞋包', icon: 'cart' },
  { label: '美妆', icon: 'gift' },
  { label: '家居', icon: 'home' },
  { label: '数码', icon: 'camera' },
  { label: '全部', icon: 'list' }
]

const heroGoods = {
  goods_id: 1,
  image: '/static/user-data/backpack.jpg'
}

const featuredGoods = [
  { goods_id: 1, name: '简约短袖衬衫', desc: '清爽浅蓝 · 舒适百搭', price: 199, image: '/static/user-data/jacket.jpg' },
  { goods_id: 2, name: '轻便休闲小白鞋', desc: '简约设计 · 轻盈舒适', price: 299, image: '/static/user-data/sneakers.jpg' },
  { goods_id: 3, name: '保湿修护精华水', desc: '深层补水 · 清爽肤感', price: 169, image: '/static/user-data/earbuds.jpg' },
  { goods_id: 4, name: '简约单肩包', desc: '时尚百搭 · 轻便大方', price: 259, image: '/static/user-data/backpack.jpg' }
]

const promoList = [
  { title: '新品上市', desc: '秋季新品抢先购', query: '新品', image: '/static/user-data/earbuds.jpg' },
  { title: '满299减30', desc: '精选好物优惠多', query: '满减', image: '/static/user-data/lamp.jpg' },
  { title: '会员专享', desc: '会员积分兑好礼', memberOnly: true, image: '/static/user-data/pillow.jpg' }
]

function navClickHandler(item) {
  if (item.label === '全部') {
    uni.switchTab({ url: '/pages/cate/cate' })
    return
  }
  uni.navigateTo({
    url: '/subpkg/goods_list/goods_list?query=' + encodeURIComponent(item.label)
  })
}

function gotoGoods(item) {
  uni.navigateTo({
    url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
  })
}

function gotoSearch() {
  uni.navigateTo({ url: '/subpkg/search/search' })
}

function openPromo(item) {
  if (item.memberOnly) {
    uni.switchTab({ url: '/pages/my/my' })
    return
  }
  uni.navigateTo({
    url: '/subpkg/goods_list/goods_list?query=' + encodeURIComponent(item.query)
  })
}

function openPromoList() {
  uni.navigateTo({
    url: '/subpkg/goods_list/goods_list?query=' + encodeURIComponent('精选')
  })
}

function openNotifications() {
  uni.showToast({ title: '暂无新消息', icon: 'none' })
}

function formatPrice(value) {
  return Number(value).toFixed(0)
}

useTabbarBadge()
</script>

<style lang="scss">
.home-page{
  min-height: 100vh;
  padding-bottom: 28rpx;
  background: #f7f9fc;
}
.home-search-row{
  display: flex;
  align-items: center;
  padding: 8rpx 24rpx 2rpx;
  background: #f7f9fc;
  .home-search-flex{
    flex: 1;
    min-width: 0;
  }
  .home-notice{
    width: 50rpx;
    margin-left: 8rpx;
    text-align: center;
  }
}
.hero-card{
  display: flex;
  align-items: center;
  height: 260rpx;
  margin: 0 24rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background: #edf4fb;
  box-shadow: 0 12rpx 28rpx rgba(61, 95, 132, .08);
  .hero-copy{
    z-index: 1;
    width: 52%;
    padding-left: 34rpx;
  }
  .hero-kicker,
  .hero-title,
  .hero-subtitle{
    display: block;
  }
  .hero-kicker{
    color: $shop-primary;
    font-size: 10px;
    letter-spacing: 2px;
  }
  .hero-title{
    margin-top: 12rpx;
    color: $shop-text;
    font-size: 24px;
    font-weight: 700;
  }
  .hero-subtitle{
    margin-top: 8rpx;
    color: $shop-muted;
    font-size: 12px;
  }
  .hero-button{
    width: 120rpx;
    height: 48rpx;
    margin-top: 20rpx;
    border-radius: 8rpx;
    color: #fff;
    background: $shop-primary-dark;
    font-size: 12px;
    line-height: 48rpx;
    text-align: center;
  }
  .hero-image{
    width: 48%;
    height: 100%;
    transform: scale(1.16);
  }
}
.hero-dots{
  display: flex;
  justify-content: center;
  gap: 12rpx;
  padding: 14rpx 0 18rpx;
  text{
    width: 10rpx;
    height: 10rpx;
    border-radius: 50%;
    background: #c8d3df;
    &.active{
      width: 26rpx;
      border-radius: 8rpx;
      background: $shop-primary;
    }
  }
}
.home-nav{
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 0 24rpx 28rpx;
  padding: 12rpx 4rpx 6rpx;
  border-radius: 16rpx;
  background: $shop-surface;
  .home-nav-item{
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: $shop-text;
    font-size: 10px;
  }
  .nav-round{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 68rpx;
    height: 68rpx;
    margin-bottom: 8rpx;
    border-radius: 50%;
    background: #f0f5fa;
  }
}
.section-head{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 24rpx 16rpx;
  .section-title{
    color: $shop-text;
    font-size: 16px;
    font-weight: 700;
  }
  .section-more{
    color: $shop-muted;
    font-size: 11px;
  }
}
.featured-grid{
  display: flex;
  justify-content: space-between;
  margin: 0 24rpx 28rpx;
}
.featured-card{
  width: calc(25% - 9rpx);
  min-width: 0;
  overflow: hidden;
  border: 1px solid $shop-border;
  border-radius: 12rpx;
  background: $shop-surface;
  .featured-image-wrap{
    height: 154rpx;
    background: #f3f6f9;
    image{
      width: 100%;
      height: 100%;
    }
  }
  .featured-name,
  .featured-desc{
    display: block;
    overflow: hidden;
    padding: 0 10rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .featured-name{
    margin-top: 12rpx;
    color: $shop-text;
    font-size: 11px;
  }
  .featured-desc{
    margin-top: 6rpx;
    color: $shop-muted;
    font-size: 9px;
  }
  .featured-bottom{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12rpx 10rpx 14rpx;
  }
  .featured-price{
    color: $shop-primary-dark;
    font-size: 15px;
    font-weight: 700;
  }
}
.promo-section{
  margin: 0 24rpx;
  padding: 18rpx 0 0;
  border-radius: 16rpx;
  background: #eef3f8;
  .promo-head{
    margin-bottom: 14rpx;
  }
  .promo-grid{
    display: flex;
    gap: 10rpx;
    padding: 0 14rpx 14rpx;
  }
  .promo-card{
    position: relative;
    flex: 1;
    min-width: 0;
    min-height: 136rpx;
    overflow: hidden;
    padding: 16rpx;
    border-radius: 10rpx;
    background: rgba(255,255,255,.78);
    box-sizing: border-box;
    &:active{
      opacity: .72;
      transform: translateY(1rpx);
    }
    .promo-title,
    .promo-desc,
    .promo-link{
      position: relative;
      z-index: 1;
      display: block;
    }
    .promo-title{
      color: $shop-text;
      font-size: 11px;
      font-weight: 600;
    }
    .promo-desc{
      margin-top: 6rpx;
      color: $shop-muted;
      font-size: 9px;
    }
    .promo-link{
      margin-top: 18rpx;
      color: $shop-primary-dark;
      font-size: 9px;
    }
    image{
      position: absolute;
      right: -8rpx;
      bottom: -4rpx;
      width: 90rpx;
      height: 90rpx;
      opacity: .7;
    }
  }
}
</style>
