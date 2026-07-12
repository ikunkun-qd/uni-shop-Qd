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
        <view class="fav" @click="toggleFavorite">
          <uni-icons :type="isFavorite ? 'star-filled' : 'star'" size="18" :color="isFavorite ? '#c00000' : 'gray'"></uni-icons>
          <text>{{isFavorite ? '已收藏' : '收藏'}}</text>
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
  import auth from '@/mixins/auth.js'
  export default {
    mixins:[auth],
    data() {
      return {
        goods_info:{},
        isFavorite:false,
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
      toHttpsUrl(url){
        if(!url) return url
        if(url.indexOf('//') === 0) return 'https:' + url
        return url.replace(/^http:\/\//, 'https://')
      },
      normalizeGoodsImages(goods){
        goods.goods_small_logo = this.toHttpsUrl(goods.goods_small_logo)
        goods.pics = (goods.pics || []).map(item => ({
          ...item,
          pics_big: this.toHttpsUrl(item.pics_big),
          pics_mid: this.toHttpsUrl(item.pics_mid),
          pics_sma: this.toHttpsUrl(item.pics_sma),
          pics_big_url: this.toHttpsUrl(item.pics_big_url),
          pics_mid_url: this.toHttpsUrl(item.pics_mid_url),
          pics_sma_url: this.toHttpsUrl(item.pics_sma_url)
        }))
        goods.goods_introduce = (goods.goods_introduce || '')
          .replace(/http:\/\//g, 'https://')
          .replace(/((?:src|data-src|href)=["'])\/\//g, '$1https://')
          .replace(/<img/g, '<img style="display:block"')
          .replace(/webp/g, 'jpg')
        return goods
      },
      async getGoodsDetail(goods_id){
        const {data:res} = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
        if(res.meta.status !== 200) return uni.$showMsg()
        this.goods_info = this.normalizeGoodsImages(res.message)
      },
      preview(i){
        uni.previewImage({
          current:i,
          urls:this.goods_info.pics.map(item => item.pics_big)
        })
      },
      onClick(e){
        const text = e && e.content && e.content.text
        if(text === '购物车'){
          if(!this.requireLogin('/pages/cart/cart')) return
          uni.switchTab({
            url:'/pages/cart/cart'
          })
        } else if(text === '店铺'){
          uni.showToast({
            title:'店铺功能演示中',
            icon:'none'
          })
        }
      },
      toggleFavorite(){
        this.isFavorite = !this.isFavorite
        uni.showToast({
          title:this.isFavorite ? '收藏成功' : '已取消收藏',
          icon:'none'
        })
      },
      addCurrentGoods(showToast = true){
        if(!this.goods_info.goods_id) return false
        if(!this.requireLogin('/pages/cart/cart')) return false
        const goods = {
          goods_id:this.goods_info.goods_id,
          goods_name:this.goods_info.goods_name,
          goods_price:this.goods_info.goods_price,
          goods_count:1,
          goods_small_logo:this.goods_info.goods_small_logo,
          goods_state:true
        }
        this.$store.commit('m_cart/addCart', goods)
        if(showToast){
          uni.showToast({
            title:'已加入购物车',
            icon:'success'
          })
        }
        return true
      },
      buttonClick(e){
        const text = e && e.content && e.content.text
        if(text === '加入购物车'){
          this.addCurrentGoods()
        } else if(text === '立即购买'){
          if(!this.addCurrentGoods(false)) return
          uni.switchTab({
            url:'/pages/cart/cart'
          })
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
