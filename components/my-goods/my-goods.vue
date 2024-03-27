<template>
  <view>
    <view class="goods-item">
      <!-- 左侧的盒子 -->
      <view class="goods-item-left">
        <image class="goods-pic" :src="item.goods_small_logo || defaultPic"></image>
      </view>
      <!-- 右侧的盒子 -->
      <view class="goods-item-right">
        <!-- 商品的名字 -->
        <view class="goods-name">{{item.goods_name}}</view>
        <view class="goods-info-box">
          <view class="goods_price">￥{{item.goods_price | toFix}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    props:{
      item:{
        type:Object,
        default:{}
      }
    },
    data() {
      return {
                defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    filters:{
      toFix(num){
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
.goods-item{
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods-item-left{
    margin-right: 10px;
    .goods-pic{
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .goods-name{
      font-size: 13px;
    }
    .goods-info-box{
      .goods_price{
        color: #c00000;
        font-size: 15px;
      }
    }
  }
}
</style>