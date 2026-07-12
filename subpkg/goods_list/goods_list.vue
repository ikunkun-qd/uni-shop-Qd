<template>
  <view class="goods-list-page">
    <view class="goods-list-head">
      <view>
        <text class="goods-list-kicker">SHOP</text>
        <text class="goods-list-title">{{queryObj.query || '全部商品'}}</text>
      </view>
      <text class="goods-total">{{total}} 件商品</text>
    </view>
    <view class="goods-sort-bar">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
      <text>筛选</text>
    </view>
    <view class="goods-list">
      <view class="goods-card" v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)" >
        <view class="goods-image-wrap">
          <image class="goods-image" :src="getImageUrl(item.goods_small_logo)" mode="aspectFill"></image>
          <text class="goods-card-tag">精选</text>
        </view>
        <view class="goods-card-body">
          <text class="goods-name">{{item.goods_name}}</text>
          <text class="goods-desc">轻盈质感 · 日常好物</text>
          <view class="goods-card-bottom">
            <text class="goods-price">￥{{formatPrice(item.goods_price)}}</text>
            <uni-icons type="cart" size="20" color="#5D7FA4"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

const queryObj = reactive({
  query: '',
  cid: '',
  pagenum: 1,
  pageSize: 10
})
const goodsList = ref([])
const total = ref(0)
const isLoading = ref(false)

async function getGoodsList(callback) {
  isLoading.value = true
  const { data: res } = await uni.$http.get('/api/public/v1/goods/search', queryObj)
  isLoading.value = false
  if (callback) callback()
  if (res.meta.status !== 200) return uni.$showMsg()
  goodsList.value = [...goodsList.value, ...res.message.goods]
  total.value = res.message.total
}

function gotoDetail(item) {
  uni.navigateTo({
    url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
  })
}

function getImageUrl(url) {
  if (!url) return '/static/logo.png'
  if (url.indexOf('//') === 0) return 'https:' + url
  return url.replace(/^http:\/\//, 'https://')
}

function formatPrice(value) {
  return Number(value).toFixed(2)
}

function loadByRouteOptions(option = {}) {
  const nextQuery = option.query || ''
  const nextCid = option.cid || ''
  const isSameQuery = queryObj.query === nextQuery && queryObj.cid === nextCid
  if (isSameQuery && (goodsList.value.length || total.value || isLoading.value)) return

  queryObj.query = nextQuery
  queryObj.cid = nextCid
  queryObj.pagenum = 1
  total.value = 0
  isLoading.value = false
  goodsList.value = []
  getGoodsList()
}

function getCurrentRouteOptions() {
  // H5 的 keep-alive 路由切换不会重新触发 onLoad，优先从 hash 读取最新参数。
  if (typeof window !== 'undefined') {
    const queryString = window.location.hash.split('?')[1] || ''
    return queryString.split('&').reduce((options, pair) => {
      const [key, value = ''] = pair.split('=')
      if (key === 'query' || key === 'cid') options[key] = decodeURIComponent(value)
      return options
    }, {})
  }

  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const pageOptions = currentPage?.options || currentPage?.$page?.options || {}
  if (pageOptions.query || pageOptions.cid) return pageOptions
  return pageOptions
}

function syncHashRoute() {
  loadByRouteOptions(getCurrentRouteOptions())
}

onLoad(loadByRouteOptions)
onShow(() => loadByRouteOptions(getCurrentRouteOptions()))
onMounted(() => {
  if (typeof window !== 'undefined') window.addEventListener('hashchange', syncHashRoute)
})
onUnmounted(() => {
  if (typeof window !== 'undefined') window.removeEventListener('hashchange', syncHashRoute)
})

onPullDownRefresh(() => {
  queryObj.pagenum = 1
  total.value = 0
  isLoading.value = false
  goodsList.value = []
  getGoodsList(() => uni.stopPullDownRefresh())
})

onReachBottom(() => {
  if (queryObj.pagenum * queryObj.pageSize >= total.value) return uni.$showMsg('数据加载完毕！')
  if (isLoading.value) return
  queryObj.pagenum++
  getGoodsList()
})
</script>

<style lang="scss">
.goods-list-page{
  min-height: 100vh;
  padding: 26rpx 24rpx 40rpx;
  background: $shop-bg;
}
.goods-list-head{
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 4rpx 22rpx;
  .goods-list-kicker{
    display: block;
    color: $shop-primary;
    font-size: 10px;
    letter-spacing: 3px;
  }
  .goods-list-title{
    display: block;
    margin-top: 6rpx;
    color: $shop-text;
    font-size: 22px;
    font-weight: 700;
  }
  .goods-total{
    color: $shop-muted;
    font-size: 12px;
  }
}
.goods-sort-bar{
  display: flex;
  gap: 36rpx;
  padding: 0 4rpx 22rpx;
  color: $shop-muted;
  font-size: 12px;
  text.active{
    color: $shop-primary-dark;
    font-weight: 600;
  }
}
.goods-list{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.goods-card{
  width: calc(50% - 10rpx);
  margin-bottom: 20rpx;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid $shop-border;
  border-radius: $shop-radius;
  background: $shop-surface;
  box-shadow: $shop-shadow;
  .goods-image-wrap{
    position: relative;
    height: 300rpx;
    background: $shop-soft;
  }
  .goods-image{
    width: 100%;
    height: 100%;
  }
  .goods-card-tag{
    position: absolute;
    top: 14rpx;
    left: 14rpx;
    padding: 5rpx 10rpx;
    border-radius: 6rpx;
    color: $shop-primary-dark;
    background: rgba(255, 255, 255, .84);
    font-size: 10px;
  }
  .goods-card-body{
    padding: 18rpx 16rpx 16rpx;
  }
  .goods-name{
    display: block;
    overflow: hidden;
    color: $shop-text;
    font-size: 13px;
    line-height: 34rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .goods-desc{
    display: block;
    margin-top: 6rpx;
    color: $shop-muted;
    font-size: 10px;
  }
  .goods-card-bottom{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 18rpx;
  }
  .goods-price{
    color: $shop-accent;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
