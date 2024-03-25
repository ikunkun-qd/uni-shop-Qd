<template>
  <view class="my-search-container" :style="{'background-color':bgColor}" @click="searchBoxHandler">
    <view class="my-search-box" :style="{'border-radius': radius+'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    props:{
      bgColor:{
        type:String,
        default:'#C00000'
      },
      radius:{
        type:Number,
        default:15
      }
    },
    methods:{
      searchBoxHandler(){
        this.$emit('search')
      }
    },
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss">
.my-search-container{
  display: flex;
  height: 50px;
  // background-color: #C00000;
  padding: 0 10px;
  .my-search-box{
    display: flex;
    width: 100%;
    height: 36px;
    background-color: #ffffff;
    // border-radius: 18px;
    justify-content: center;
    align-items: center;
    .placeholder{
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>