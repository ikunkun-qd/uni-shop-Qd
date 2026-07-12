<template>
  <view class="cate-page">
    <my-search @search="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滑动区 -->
      <scroll-view class="scroll-view-left" scroll-y="true" :style="{height:wh+'px'}">
        <block v-for="(item,index) in cateList" :key="index">
          <view @click="getActive(index)" :class="['scroll-view-left-item', active === index ? 'active' : '']">{{item.cat_name}}</view>
        </block>
        
      </scroll-view>
      
      <!-- 右侧滑动区 -->
      <scroll-view scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <!-- 二级分类标题 -->
         <view class="cate-lv2-title">
           {{item2.cat_name}}
         </view> 
         
         <!-- 三级分类 -->
         <view class="cate-lv3-list">
           <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
             <image :src="item3.cat_icon"></image>
             <text>{{item3.cat_name}}</text>
           </view>
         </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useTabbarBadge } from '@/composables/use-tabbar-badge.js'

const wh = ref(0)
const cateList = ref([])
const active = ref(0)
const cateLevel2 = ref([])
const scrollTop = ref(0)

async function getCateList() {
  const { data: res } = await uni.$http.get('/api/public/v1/categories')
  if (res.meta.status !== 200) return uni.$showMsg()
  cateList.value = res.message
  cateLevel2.value = res.message[0]?.children || []
}

function getActive(index) {
  active.value = index
  cateLevel2.value = cateList.value[index].children
  scrollTop.value = scrollTop.value === 0 ? 1 : 0
}

function gotoGoodsList(item) {
  uni.navigateTo({
    url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
  })
}

function gotoSearch() {
  uni.navigateTo({ url: '/subpkg/search/search' })
}

onLoad(() => {
  const windowInfo = uni.getWindowInfo()
  wh.value = windowInfo.windowHeight - 50
  getCateList()
})
useTabbarBadge()
</script>

<style lang="scss">
.scroll-view-container{
  margin: 0 24rpx 24rpx;
  display: flex;
  overflow: hidden;
  min-height: calc(100vh - 90px);
  border: 1px solid $shop-border;
  border-radius: $shop-radius;
  background: $shop-surface;
  box-shadow: $shop-shadow;
}
.cate-page{
  min-height: 100vh;
  background: $shop-bg;
}
.cate-lv3-list{
  display:flex;
  flex-wrap:wrap;
  padding: 0 12rpx 28rpx;
  .cate-lv3-item{
    width: 33.33%;
    flex-direction:column;
    display:flex;
    justify-content:center;
    align-items:center;
      margin-bottom: 24rpx;
      padding: 0 4rpx;
      box-sizing: border-box;
  }
    image{
      width: 118rpx;
      height: 118rpx;
      border: 1px solid $shop-border;
      border-radius: 14rpx;
      background: $shop-soft;
    }
    text{
      margin-top: 8rpx;
      color: $shop-text;
      font-size:12px;
      text-align: center;
    }
}
.scroll-view-left{
  width: 184rpx;
  flex: 0 0 184rpx;
  flex-shrink: 0;
  background: $shop-soft;
}
.scroll-view-container > scroll-view:last-child{
  flex: 1;
  width: 0;
  min-width: 0;
}
.cate-lv2-title{
  text-align: left;
  font-weight:bold;
  font-size: 13px;
  padding: 26rpx 20rpx 18rpx;
  color: $shop-text;
}
.scroll-view-left-item{
  position: relative;
  background-color: transparent;
  text-align: center;
  line-height: 92rpx;
  color: $shop-muted;
  font-size: 13px;
  
  &.active{
    background-color: $shop-surface;
    color: $shop-primary-dark;
    font-weight: 600;
    
    &::before{
      content: '';
      display: block;
      width: 6rpx;
      height: 34rpx;
      border-radius: 0 6rpx 6rpx 0;
      background-color: $shop-primary;
      position: absolute;
      top: 50%;
      left: 0%;
      transform: translateY(-50%);
    }
  }
}
</style>
