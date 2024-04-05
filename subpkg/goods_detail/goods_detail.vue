<template>
  <view v-if="goods_info.goods_price" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <view class="price">￥{{goods_info.goods_price}}</view>
      <view class="goods-info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <view class="fav">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="yf">快递：免费运</view>
    </view>
    
    <!-- <div v-html="goods_info.goods_introduce"></div> -->
     <rich-text :nodes="goods_info.goods_introduce"></rich-text>
     
     <view class="goods-nav">
       <uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
     </view>
  </view>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
import cart from '../../store/cart';
  export default {
    data() {
      return {
        goods_info:{},
        options: [{
        			icon: 'shop',
        			text: '店铺',
        			infoBackgroundColor:'#007aff',
        			infoColor:"red"
        		}, {
        			icon: 'cart',
        			text: '购物车',
        			info: 0
        		}],
        	    buttonGroup: [{
        	      text: '加入购物车',
        	      backgroundColor: '#ff0000',
        	      color: '#fff'
        	    },
        	    {
        	      text: '立即购买',
        	      backgroundColor: '#ffa200',
        	      color: '#fff'
        	    }
        	    ]
      };
    },
    onLoad(options) {
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    computed:{
      ...mapState('m_cart', ['cart']),
      ...mapGetters('m_cart', ['total'])
    },
    watch:{
      // total(newValue){
      //   const finds = this.options.find(item => item.text === '购物车')
      //   if(finds){
      //     finds.info = newValue
      //   }
      // }
      
      total:{
        handler(newValue){
          const finds = this.options.find(item => item.text === '购物车')
          if(finds){
            finds.info = newValue
          }
        },
        immediate:true
      }
    },
    methods:{
      async getGoodsDetail(goods_id){
        const {data:res} = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
        if(res.meta.status !== 200) return uni.$showMsg()
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g, '<img style="display:block"').replace(/webp/g, 'jpg')
        this.goods_info = res.message
      },
      preview(i){
        uni.previewImage({
          current:i,
          urls:this.goods_info.pics.map(item => item.pics_big)
        })
      },
      onClick(e){
        if(e.content.text === '购物车'){
          uni.switchTab({
            url:'/pages/cart/cart'
          })
        }
      },
      buttonClick(e){
        // console.log(e)
        if(e.content.text === '加入购物车'){
          const goods = {
            goods_id:this.goods_info.goods_id,
            goods_name:this.goods_info.goods_name,
            goods_price:this.goods_info.goods_price,
            goods_count:1,
            goods_small_logo:this.goods_info.goods_small_logo,
            goods_state:true
          }
          this.$store.commit('m_cart/addCart', goods)
        }
      }
    }
  }
</script>

<style lang="scss">
.goods-detail-container{
  padding-bottom: 50px;
}
.goods-nav{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
swiper{
  height: 750rpx;
  image{
    width: 100%;
    height: 100%;
  }
}
.goods-info-box{
  margin-left: 10px;
  .price{
    color: #c00000;
    padding-top: 15px;
    font-size: 20px;
  }
  .goods-info-body{
    display: flex;
    justify-content: space-between;
    .goods-name{
      font-size: 14px;
      margin: 15px 5px;
    }
    .fav{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 120px;
      margin: 13px 0;
      border-left: 2px solid #efefef;
      text{
        font-size: 14px;
        color: gray;
      }
    }
  }
  .yf{
    font-size: 13px;
    color: gray;
  }
}
</style>
