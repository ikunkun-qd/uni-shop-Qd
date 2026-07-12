<template>
  <view class="user-data-page">
    <view class="data-tabs">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['data-tab', { active: currentType === tab.type }]"
        @click="switchType(tab.type)"
      >
        <text>{{tab.label}}</text>
        <text class="tab-count">{{tabCount(tab.type)}}</text>
      </view>
    </view>

    <view class="data-summary">
      <text>{{currentTab.label}}</text>
      <text class="summary-count">共 {{currentCount}} 条记录</text>
    </view>

    <scroll-view class="data-list" scroll-y>
      <view v-if="currentItems.length" class="data-list-content">
        <view v-for="(item, index) in currentItems" :key="item.id || item.goods_id + '-' + index">
          <!-- 店铺列表 -->
          <view v-if="currentType === 'shops'" class="shop-card">
            <image class="shop-logo" :src="item.logo || '/static/logo.png'" mode="aspectFill"></image>
            <view class="shop-content">
              <text class="shop-name">{{item.name}}</text>
              <text class="shop-meta">{{item.category}} · {{item.fans}}</text>
              <text class="shop-discount">{{item.discount}}</text>
            </view>
          </view>

          <!-- 商品收藏、关注和足迹列表 -->
          <view v-else class="goods-card">
            <image class="goods-image" :src="item.image || '/static/logo.png'" mode="aspectFill"></image>
            <view class="goods-content">
              <text class="goods-title">{{item.title}}</text>
              <view class="goods-label-row">
                <text class="goods-tag">{{item.tag}}</text>
                <text class="goods-sales">{{item.sales}}</text>
              </view>
              <view class="goods-bottom">
                <view>
                  <text class="goods-price">￥{{formatPrice(item.price)}}</text>
                  <text class="goods-old-price">￥{{formatPrice(item.oldPrice)}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-data">
        <image src="/static/cart_empty@2x.png" class="empty-image"></image>
        <text>这里还没有数据</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserDataStore } from '@/store/user-data.js'

const userDataStore = useUserDataStore()
const { data, counts } = storeToRefs(userDataStore)
const currentType = ref('shops')
const tabs = [
  { type: 'shops', label: '收藏的店铺' },
  { type: 'favoriteGoods', label: '收藏的商品' },
  { type: 'followedGoods', label: '关注的商品' },
  { type: 'footprints', label: '足迹' }
]
const currentTab = computed(() => tabs.find(tab => tab.type === currentType.value) || tabs[0])
const currentItems = computed(() => data.value[currentType.value] || [])
const currentCount = computed(() => counts.value[currentType.value] || currentItems.value.length)

function tabCount(type) {
  return counts.value[type] || 0
}

function updateTitle() {
  uni.setNavigationBarTitle({ title: currentTab.value.label })
}

function switchType(type) {
  currentType.value = type
  updateTitle()
}

function formatPrice(price) {
  return Number(price).toFixed(2)
}

onLoad((options) => {
  const type = options && options.type ? decodeURIComponent(options.type) : 'shops'
  if (tabs.some(tab => tab.type === type)) currentType.value = type
  updateTitle()
})
</script>

<style lang="scss">
.user-data-page{
  min-height: 100vh;
  background-color: $shop-bg;
}
.data-tabs{
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-around;
  background-color: $shop-surface;
  border-bottom: 1px solid $shop-border;
  .data-tab{
    position: relative;
    height: 48px;
    line-height: 48px;
      color: $shop-muted;
    font-size: 12px;
    &.active{
      color: $shop-primary-dark;
      font-weight: bold;
      &::after{
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 28px;
        height: 3px;
        border-radius: 3px;
        background-color: $shop-primary;
        transform: translateX(-50%);
      }
    }
  }
  .tab-count{
    margin-left: 2px;
    color: $shop-primary;
    font-size: 10px;
  }
}
.data-summary{
  display: flex;
  justify-content: space-between;
  padding: 14px 12px 8px;
  color: $shop-text;
  font-size: 14px;
  .summary-count{
    color: #999;
    font-size: 12px;
  }
}
.data-list{
  height: calc(100vh - 84px);
}
.data-list-content{
  padding: 0 24rpx 28rpx;
}
.shop-card,
.goods-card{
  display: flex;
  align-items: center;
  margin-bottom: 18rpx;
  padding: 20rpx;
  border: 1px solid $shop-border;
  border-radius: $shop-radius;
  background-color: $shop-surface;
  box-shadow: $shop-shadow;
}
.shop-card{
  .shop-logo{
    width: 58px;
    height: 58px;
    border-radius: 29px;
    background-color: $shop-soft;
  }
  .shop-content{
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 0 10px;
    .shop-name{
      overflow: hidden;
      color: $shop-text;
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .shop-meta,
    .shop-discount{
      margin-top: 7px;
      color: $shop-muted;
      font-size: 11px;
    }
    .shop-discount{
      color: #e66b16;
    }
  }
}
.goods-card{
  align-items: flex-start;
  .goods-image{
    width: 88px;
    height: 88px;
    flex-shrink: 0;
    border-radius: 4px;
    background-color: #f8f8f8;
  }
  .goods-content{
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 88px;
    padding-left: 10px;
    .goods-title{
      color: #333;
      font-size: 13px;
      line-height: 20px;
    }
    .goods-label-row{
      display: flex;
      align-items: center;
      margin-top: 8px;
      .goods-tag{
        padding: 2px 5px;
        border-radius: 2px;
      color: $shop-primary-dark;
      background-color: $shop-soft;
        font-size: 10px;
      }
      .goods-sales{
        margin-left: 8px;
        color: $shop-muted;
        font-size: 10px;
      }
    }
    .goods-bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      .goods-price{
        color: $shop-accent;
        font-size: 16px;
        font-weight: bold;
      }
      .goods-old-price{
        margin-left: 5px;
        color: #aaa;
        font-size: 10px;
        text-decoration: line-through;
      }
    }
  }
}
.empty-data{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  color: #999;
  font-size: 13px;
  .empty-image{
    width: 100px;
    height: 100px;
    margin-bottom: 12px;
  }
}
</style>
