<template>
  <view  class="my-settle-container">
    <!-- 全选 -->
    <label class="radio">
      <radio @click="isAllChecked" :checked="isFullChecked" color="#c00000" /><text>全选</text>
    </label>
    
    <!-- 合计 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedTotalPrice}}</text>
    </view>
    
    <!-- 结算 -->
    <view class="btn-settle">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import { mapGetters,mapMutations } from 'vuex';
  export default {
    name:"my-settle",
    data() {
      return {
        
      };
    },
    computed:{
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedTotalPrice']),
      isFullChecked(){
        return this.total === this.checkedCount
      }
    },
    methods:{
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      isAllChecked(){
         this.updateAllGoodsState(!this.isFullChecked)
      }
    }
  }
</script>

<style lang="scss">
.my-settle-container{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  font-size: 14px;

  .radio{
    display: flex;
    align-items: center;
  }
  .amount-box{
    .amount{
      color: #c00000;
      font-weight: bold;
    }
  }
  .btn-settle{
    height: 50px;
    min-width: 100px;
    line-height: 50px;
    text-align: center;
    background-color: #c00000;
    padding: 0 10px;
    color: white;
  }
}
</style>