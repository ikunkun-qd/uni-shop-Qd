<template>
  <view>
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
        <uni-tag @click="gotoGoodsList(item)" :text="item" v-for="(item, i) in histories" :key="i"></uni-tag>
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
  .search-box{
    position: sticky;
    top: 0%;
    z-index: 999;
  }
  .sugg-list{
    padding: 0 15px;
    .sugg-item{
      font-size: 15px;
      padding: 30px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #efefef;
      .goods-name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }
  .history-box{
    margin: 0px 5px;
    .history-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #efefef;
      margin: 5px 5px;
      height: 40px;
      font-size: 16px;
    }
    .history-list{
      display: flex;
      flex-wrap: wrap;
        uni-tag{
          margin: 5px 5px;
        }
    }
  }
</style>
