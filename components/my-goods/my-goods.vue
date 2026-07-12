<template>
  <view>
    <view class="goods-item">
      <!-- 左侧的盒子 -->
      <view class="goods-item-left">
        <radio @click="radioClickHandler" :checked="props.item.goods_state" color="#2f766d" v-if="props.showRadios"></radio>
        <image @click="gotoDetail(props.item)" class="goods-pic" :src="getImageUrl(props.item.goods_small_logo)"></image>
      </view>
      <!-- 右侧的盒子 -->
      <view class="goods-item-right">
        <!-- 商品的名字 -->
        <view @click="gotoDetail(props.item)" class="goods-name">{{props.item.goods_name}}</view>
        <view class="goods-info-box">
          <view class="goods_price">￥{{formatPrice(props.item.goods_price)}}</view>
          <uni-number-box :min="1" :value="props.item.goods_count" v-if="props.showCount" @change="numChange"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  showRadios: {
    type: Boolean,
    default: false
  },
  showCount: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['radioChange', 'countChange'])
const defaultPic = 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'

function getImageUrl(url) {
  const imageUrl = url || defaultPic
  if (imageUrl.indexOf('//') === 0) return 'https:' + imageUrl
  return imageUrl.replace(/^http:\/\//, 'https://')
}

function radioClickHandler() {
  emit('radioChange', {
    goods_id: props.item.goods_id,
    goods_state: !props.item.goods_state
  })
}

function numChange(value) {
  emit('countChange', {
    goods_id: props.item.goods_id,
    goods_count: +value
  })
}

function formatPrice(value) {
  return Number(value).toFixed(2)
}

function gotoDetail(item) {
  uni.navigateTo({
    url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
  })
}
</script>

<style lang="scss">
.goods-item{
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 20rpx 12rpx;
  background: #ffffff;
  border-bottom: 1px solid #e8eeeb;
  .goods-item-left{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 10px;
    .goods-pic{
      width: 180rpx;
      height: 180rpx;
      border-radius: 12rpx;
      background: #f7f8f6;
      display: block;
    }
  }
  .goods-item-right{
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .goods-name{
      color: #1f2a2a;
      font-size: 14px;
      line-height: 40rpx;
    }
    .goods-info-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods_price{
        color: #e58b4b;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
