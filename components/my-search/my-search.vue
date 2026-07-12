<template>
  <view class="my-search-container" :style="{'background-color': props.bgColor}" @click="searchBoxHandler">
    <view class="my-search-box" :style="{'border-radius': props.radius+'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  bgColor: {
    type: String,
    default: '#2f766d'
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
  height: 50px;
  // background-color: #2f766d;
  padding: 8px 12px 6px;
  box-sizing: border-box;
  .my-search-box{
    display: flex;
    width: 100%;
    height: 34px;
    box-shadow: 0 4px 14px rgba(31, 71, 66, .08);
    background-color: #ffffff;
    // border-radius: 18px;
    justify-content: center;
    align-items: center;
    .placeholder{
      color: #8a9694;
      font-size: 14px;
      margin-left: 5px;
    }
  }
}
</style>
