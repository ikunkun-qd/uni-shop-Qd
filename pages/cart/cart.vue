<template>
  <!-- 购物车商品显示区域 -->
  <view v-if="!cart" class="cart-container">
    <!-- 收货地址组件 -->
    <my-address></my-address>
    
     <!-- 购物车商品列表的标题区域 -->
    <view class="cart-title">
      <uni-icons type="shop" size="30"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>
    
    <!-- 商品列表区域 -->
    <uni-swipe-action>
      <view class="my-goods" v-for="(item, i) in cart" :key=i>
        <uni-swipe-action-item :right-options="options" @click="swipeItemHandle(item)">
          <my-goods @countChange="countChangeHandle" @radioChange="radioChangeHandle" :item="item" :showRadios="true" :showCount="true"></my-goods>
        </uni-swipe-action-item>
      </view>
    </uni-swipe-action>
    
    <!-- 结算区域 -->
    <my-settle></my-settle>
  </view>

  <!-- 购物车空白区域 -->
  <view v-else class="empty-cart">
    <image class="empty-image" src="../../static/cart_empty@2x.png"></image>
    <text class="empty-text">空空如也~</text>
  </view>
</template>

<script>
  import mixBadge from '@/mixins/tabbar-badge.js'
  import { mapState, mapMutations } from 'vuex';
  export default {
    mixins:[mixBadge],
    computed:{
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options:[{
          text:'删除',
          style:{
            backgroundColor:'#C00000'
          }
        }]
      };
    },
    methods:{
      ...mapMutations('m_cart', ['removeGoods']),
      // 思路:通过在my-goods组件中的点击事件,将goods_id, !goods_state传过来,然后通过触发@radioChange事件进行父子组件通信,在父组件中进行接受一个为对象的参数,然后调用store仓库中的updateGoodsState方法对仓库中的cart进行修改
      radioChangeHandle(message){
        // console.log(message)
        this.$store.commit('m_cart/updateGoodsState', message)
      },
      countChangeHandle(e){
        // console.log(e)
        this.$store.commit('m_cart/updateGoodsCount', e)
      },
      swipeItemHandle(item){
        this.removeGoods(item)
      }
    }
  }
</script>

<style lang="scss">
.cart-container{
  padding-bottom: 50px;
}
.cart-title{
  display: flex;
  height: 40px;
  font-size: 14px;
  align-items: center;
  padding-left: 1px;
  border-bottom: 2px solid #efefef;
  .cart-title-text{
    margin-left: 5px;
  }
}
.empty-cart{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .empty-image{
    width: 90px;
    height: 90px;
    padding-top: 150px;
  }
  .empty-text{
    margin-top: 10px;
    font-size: 13px;
  }
}
</style>
