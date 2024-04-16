<template>
  <view>
    <view class="goods-item">
      <!-- 左侧的盒子 -->
      <view class="goods-item-left">
        <radio @click="radioClickHandler" :checked="item.goods_state" color="#c00000" v-if="showRadios"></radio>
        <image @click="gotoDetail(item)" class="goods-pic" :src="item.goods_small_logo || defaultPic"></image>
      </view>
      <!-- 右侧的盒子 -->
      <view class="goods-item-right">
        <!-- 商品的名字 -->
        <view @click="gotoDetail(item)" class="goods-name">{{item.goods_name}}</view>
        <view class="goods-info-box">
          <view class="goods_price">￥{{item.goods_price | toFix}}</view>
          <uni-number-box :min="1" :value="item.goods_count" v-if="showCount" @change="numChange"></uni-number-box>
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
      },
      showRadios:{
        type:Boolean,
        default:false
      },
      showCount:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      radioClickHandler(){
        this.$emit('radioChange', {
          goods_id:this.item.goods_id,
          goods_state:!this.item.goods_state
        })
      },
      numChange(value){
        // console.log(value)
        this.$emit('countChange', {
          goods_id:this.item.goods_id,
          goods_count:+value
        })
      },
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
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
  width: 750rpx;
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods-item-left{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 10px;
    .goods-pic{
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right{
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .goods-name{
      font-size: 13px;
    }
    .goods-info-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods_price{
        color: #c00000;
        font-size: 15px;
      }
    }
  }
}
</style>