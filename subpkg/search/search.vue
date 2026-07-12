<template>
  <view class="search-page">
    <view class="search-box">
      <uni-search-bar cancelButton="none" :radius="100" @input="input" :focus="true"></uni-search-bar>
    </view>
    
    <!-- 建议列表 -->
    <view class="sugg-list" v-if="searchList.length !== 0">
      <view class="sugg-item" v-for="(item,i) in searchList" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrow-right" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="23" @click="clean"></uni-icons>
      </view>
      
      <!-- 列表区域 -->
      <view class="history-list">
        <view class="history-tag" v-for="(item, i) in histories" :key="i">
          <uni-tag @click="gotoGoodsList(item)" :text="item"></uni-tag>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const timer = ref(null)
const kw = ref('')
const searchList = ref([])
const historyList = ref([])
const histories = computed(() => [...historyList.value].reverse())

function loadHistory() {
  const storedHistory = uni.getStorageSync('kw')
  if (Array.isArray(storedHistory)) {
    historyList.value = storedHistory
    return
  }
  if (typeof storedHistory !== 'string' || storedHistory.trim() === '') {
    historyList.value = []
    return
  }
  try {
    const parsedHistory = JSON.parse(storedHistory)
    historyList.value = Array.isArray(parsedHistory) ? parsedHistory : []
  } catch (error) {
    historyList.value = []
  }
}

function input(event) {
  const value = typeof event === 'string'
    ? event
    : (event && (event.value || (event.detail && event.detail.value))) || ''
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    kw.value = value.trim()
    getSearchList()
  }, 1000)
}

async function getSearchList() {
  if (kw.value === '') {
    searchList.value = []
    return
  }
  const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: kw.value })
  if (res.meta.status !== 200) return uni.$showMsg()
  searchList.value = res.message
  saveSearchList()
}

function gotoDetail(item) {
  uni.navigateTo({
    url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
  })
}

function saveSearchList() {
  const set = new Set(historyList.value)
  set.delete(kw.value)
  set.add(kw.value)
  historyList.value = Array.from(set)
  uni.setStorageSync('kw', JSON.stringify(historyList.value))
}

function clean() {
  historyList.value = []
  uni.setStorageSync('kw', JSON.stringify([]))
}

function gotoGoodsList(goodsName) {
  uni.navigateTo({
    url: '/subpkg/goods_list/goods_list?query=' + encodeURIComponent(goodsName)
  })
}

onLoad(loadHistory)
onUnmounted(() => clearTimeout(timer.value))
</script>

<style lang="scss">
  .search-page{
    min-height: 100vh;
    background: $shop-bg;
  }
  .search-box{
    position: sticky;
    top: 0;
    z-index: 999;
    padding: 10rpx 24rpx;
    background: rgba(244, 247, 250, .94);
    .uni-searchbar{
      padding: 0;
      background: transparent !important;
    }
    .uni-searchbar__box{
      height: 74rpx;
      border: 1px solid $shop-border;
      background: $shop-surface;
      box-shadow: 0 6rpx 18rpx rgba(28, 42, 58, .04);
    }
  }
  .sugg-list{
    margin: 0 24rpx;
    padding: 0 20rpx;
    border: 1px solid $shop-border;
    border-radius: $shop-radius;
    background: $shop-surface;
    .sugg-item{
      font-size: 15px;
      padding: 28rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $shop-border;
      .goods-name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }
  .history-box{
    margin: 18rpx 24rpx;
    padding: 24rpx;
    border: 1px solid $shop-border;
    border-radius: $shop-radius;
    background: $shop-surface;
    .history-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $shop-border;
      margin: 0 0 18rpx;
      height: 40px;
      color: $shop-text;
      font-size: 16px;
      font-weight: 600;
    }
    .history-list{
      display: flex;
      flex-wrap: wrap;
      .history-tag{
        display: inline-flex;
        margin: 0 14rpx 14rpx 0;
      }
    }
  }
</style>
