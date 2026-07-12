<template>
  <view class="my-search-container" :style="{'background-color': props.bgColor}" @click="searchBoxHandler">
    <view class="my-search-box" :style="{'border-radius': props.radius+'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索商品</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  bgColor: {
    type: String,
    default: '#F4F7FA'
  },
  radius: {
    type: Number,
    default: 15
  }
})

const emit = defineEmits(['search'])

function searchBoxHandler() {
  emit('search')
}
</script>

<style lang="scss">
.my-search-container{
  display: flex;
  height: 58px;
  padding: 12px 24rpx 10px;
  box-sizing: border-box;
  background: $shop-bg;
  .my-search-box{
    display: flex;
    width: 100%;
    height: 36px;
    box-shadow: 0 6rpx 18rpx rgba(28, 42, 58, .04);
    border: 1px solid $shop-border;
    background-color: $shop-surface;
    justify-content: flex-start;
    align-items: center;
    padding: 0 24rpx;
    box-sizing: border-box;
    .placeholder{
      color: $shop-muted;
      font-size: 14px;
      margin-left: 10rpx;
    }
  }
}
</style>
