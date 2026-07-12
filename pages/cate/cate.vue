<template>
  <view>
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
  margin: 12rpx;
  display: flex;
  overflow: hidden;
  border-radius: 20rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(42, 83, 77, .06);
}
.cate-lv3-list{
  display:flex;
  flex-wrap:wrap;
  .cate-lv3-item{
    width: 33.33%;
    flex-direction:column;
    display:flex;
    justify-content:center;
    align-items:center;
      margin-bottom: 18rpx;
  }
    image{
      width: 112rpx;
      height: 112rpx;
      border-radius: 16rpx;
      background: #f7f8f6;
    }
    text{
      margin-top: 8rpx;
      color: #53615f;
      font-size:12px;
    }
}
.scroll-view-left{
  width: 190rpx;
  background: #f7f8f6;
}
.cate-lv2-title{
  text-align: center;
  font-weight:bold;
  font-size: 12px;
  padding: 24rpx 0 16rpx;
  color: #1f2a2a;
}
.scroll-view-left-item{
  background-color: #F7F7F7;
  text-align: center;
  line-height: 92rpx;
  color: #6e7b79;
  font-size: 13px;
  
  &.active{
    background-color: #FFFFFF;
      position: relative;
    
    &::before{
      content: '';
      display: block;
      width: 6rpx;
      height: 60rpx;
      background-color: #2f766d;
      position: absolute;
      top: 50%;
      left: 0%;
      transform: translateY(-50%);
    }
  }
}
</style>
