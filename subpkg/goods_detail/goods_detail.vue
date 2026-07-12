<template>
  <view v-if="goods_info.goods_price" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <view class="price">￥{{goods_info.goods_price}}</view>
      <view class="goods-info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <view class="fav" @click="toggleFavorite">
          <uni-icons :type="isFavorite ? 'star-filled' : 'star'" size="18" :color="isFavorite ? '#BD7B62' : '#8793A2'"></uni-icons>
          <text>{{isFavorite ? '已收藏' : '收藏'}}</text>
        </view>
      </view>
      <view class="yf">快递：免费运</view>
    </view>
    
    <!-- <div v-html="goods_info.goods_introduce"></div> -->
     <view class="goods-introduce">
       <rich-text :nodes="goods_info.goods_introduce"></rich-text>
     </view>
     
     <view class="goods-nav">
       <uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
     </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart.js'
import { useAuth } from '@/composables/use-auth.js'

const cartStore = useCartStore()
const { total } = storeToRefs(cartStore)
const { requireLogin } = useAuth()
const goods_info = ref({})
const isFavorite = ref(false)
const options = ref([
  {
    icon: 'shop',
    text: '店铺',
    infoBackgroundColor: '#5D7FA4',
    infoColor: '#5D7FA4'
  },
  {
    icon: 'cart',
    text: '购物车',
    info: 0
  }
])
const buttonGroup = [
  {
    text: '加入购物车',
    backgroundColor: '#5D7FA4',
    color: '#fff'
  },
  {
    text: '立即购买',
    backgroundColor: '#BD7B62',
    color: '#fff'
  }
]

function toHttpsUrl(url) {
  if (!url) return url
  if (url.indexOf('//') === 0) return 'https:' + url
  return url.replace(/^http:\/\//, 'https://')
}

function normalizeGoodsImages(goods) {
  goods.goods_small_logo = toHttpsUrl(goods.goods_small_logo)
  goods.pics = (goods.pics || []).map(item => ({
    ...item,
    pics_big: toHttpsUrl(item.pics_big),
    pics_mid: toHttpsUrl(item.pics_mid),
    pics_sma: toHttpsUrl(item.pics_sma),
    pics_big_url: toHttpsUrl(item.pics_big_url),
    pics_mid_url: toHttpsUrl(item.pics_mid_url),
    pics_sma_url: toHttpsUrl(item.pics_sma_url)
  }))
  goods.goods_introduce = (goods.goods_introduce || '')
    .replace(/http:\/\//g, 'https://')
    .replace(/((?:src|data-src|href)=["'])\/\//g, '$1https://')
    .replace(/<img/g, '<img style="display:block"')
    .replace(/webp/g, 'jpg')
  return goods
}

async function getGoodsDetail(goodsId) {
  const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id: goodsId })
  if (res.meta.status !== 200) return uni.$showMsg()
  goods_info.value = normalizeGoodsImages(res.message)
}

function preview(index) {
  uni.previewImage({
    current: index,
    urls: goods_info.value.pics.map(item => item.pics_big)
  })
}

function onClick(event) {
  const text = event && event.content && event.content.text
  if (text === '购物车') {
    if (!requireLogin('/pages/cart/cart')) return
    uni.switchTab({ url: '/pages/cart/cart' })
  } else if (text === '店铺') {
    uni.showToast({ title: '店铺功能演示中', icon: 'none' })
  }
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
  uni.showToast({
    title: isFavorite.value ? '收藏成功' : '已取消收藏',
    icon: 'none'
  })
}

function addCurrentGoods(showToast = true) {
  if (!goods_info.value.goods_id) return false
  if (!requireLogin('/pages/cart/cart')) return false
  cartStore.addCart({
    goods_id: goods_info.value.goods_id,
    goods_name: goods_info.value.goods_name,
    goods_price: goods_info.value.goods_price,
    goods_count: 1,
    goods_small_logo: goods_info.value.goods_small_logo,
    goods_state: true
  })
  if (showToast) {
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }
  return true
}

function buttonClick(event) {
  const text = event && event.content && event.content.text
  if (text === '加入购物车') {
    addCurrentGoods()
  } else if (text === '立即购买') {
    if (!addCurrentGoods(false)) return
    uni.switchTab({ url: '/pages/cart/cart' })
  }
}

watch(total, (newValue) => {
  const finds = options.value.find(item => item.text === '购物车')
  if (finds) finds.info = newValue
}, { immediate: true })

onLoad((pageOptions) => {
  getGoodsDetail(pageOptions.goods_id)
})
</script>

<style lang="scss">
.goods-detail-container{
  min-height: 100vh;
  padding-bottom: 62px;
  background: $shop-bg;
}
.goods-nav{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
swiper{
  height: 680rpx;
  background: $shop-surface;
  image{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.goods-introduce{
  margin: 20rpx 24rpx 0;
  padding: 24rpx;
  overflow: hidden;
  border: 1px solid $shop-border;
  border-radius: $shop-radius;
  background: $shop-surface;
}
.goods-info-box{
  margin: 20rpx 24rpx 0;
  padding: 24rpx;
  border: 1px solid $shop-border;
  border-radius: $shop-radius;
  background: $shop-surface;
  box-shadow: $shop-shadow;
  .price{
    color: $shop-accent;
    padding-top: 0;
    font-size: 24px;
    font-weight: 700;
  }
  .goods-info-body{
    display: flex;
    justify-content: space-between;
      .goods-name{
      flex: 1;
      color: $shop-text;
      font-size: 16px;
      line-height: 42rpx;
      margin: 15px 12px 12px 0;
    }
    .fav{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 94px;
      margin: 13px 0 13px 12px;
      border-left: 1px solid $shop-border;
      text{
        font-size: 14px;
        color: $shop-muted;
      }
    }
  }
  .yf{
    font-size: 13px;
    color: $shop-muted;
}
}
</style>
