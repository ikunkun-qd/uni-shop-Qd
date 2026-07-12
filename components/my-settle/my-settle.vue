<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio">
      <radio @click="isAllChecked" :checked="isFullChecked" color="#c00000" /><text>全选</text>
    </label>

    <!-- 合计 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedTotalPrice}}</text>
    </view>

    <!-- 批量操作 -->
    <view class="settle-actions">
      <view @click="removeSelected" :class="['btn-delete', { disabled: !checkedCount }]">
        批量删除
      </view>
      <view @click="settlement" :class="['btn-settle', { disabled: isSubmitting }]">
        结算({{checkedCount}})
      </view>
    </view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations, mapState } from 'vuex';
  export default {
    name:"my-settle",
    data() {
      return {
        seconds:3,
        timer:null,
        isSubmitting:false
      };
    },
    computed:{
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedTotalPrice']),
      ...mapGetters('m_user', ['addStr']),
      ...mapState('m_user', ['token', 'address']),
      ...mapState('m_cart', ['cart']),
      isFullChecked(){
        return this.total === this.checkedCount
      },
      hasAddress(){
        return Boolean(
          this.address &&
          this.address.userName &&
          this.address.telNumber &&
          this.addStr
        )
      }
    },
    methods:{
      ...mapMutations('m_cart', ['updateAllGoodsState', 'removeCheckedGoods']),
      ...mapMutations('m_user', ['updateRedirectInfo']),

      isAllChecked(){
        this.updateAllGoodsState(!this.isFullChecked)
      },
      removeSelected(){
        if(!this.checkedCount) return uni.$showMsg('请选择要删除的商品~')

        uni.showModal({
          title:'批量删除',
          content:'确定删除选中的商品吗？',
          success:(res)=>{
            if(res.confirm) this.removeCheckedGoods()
          }
        })
      },
      showTips(n){
        uni.showToast({
          icon:'none',
          title:'请登录后再结算！'+n+' 秒后自动跳转到登录页',
          duration:1500,
          mask:true
        })
      },
      settlement(){
        if(this.isSubmitting) return
        if(!this.hasAddress) return uni.$showMsg('请选择收货地址~')
        if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品~')
        if(!this.token) return this.delayNavigate()

        this.payOrder()
      },
      delayNavigate(){
        if(this.timer) clearInterval(this.timer)
        this.seconds = 3
        this.showTips(this.seconds)
        this.timer = setInterval(()=>{
          this.seconds--
          if(this.seconds <= 0){
            clearInterval(this.timer)
            this.timer = null
            this.updateRedirectInfo({
              openType:'switchTab',
              from:'/pages/cart/cart'
            })
            uni.switchTab({
              url:'/pages/my/my'
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      payOrder(){
        this.isSubmitting = true
        // 面试演示使用本地订单，不调用真实支付接口。
        const orderInfo = {
          order_price:Number(this.checkedTotalPrice),
          consignee_addr:this.addStr,
          goods:this.cart
            .filter(item => item.goods_state === true)
            .map(item => ({
              goods_id:item.goods_id,
              goods_number:item.goods_count,
              goods_price:item.goods_price
            }))
        }

        uni.showLoading({ title:'订单提交中...' })
        setTimeout(()=>{
          uni.hideLoading()
          this.$store.commit('m_cart/removeCheckedGoods')
          this.isSubmitting = false
          uni.showToast({
            title:'支付成功（演示）',
            icon:'success'
          })
        }, 500)

        return orderInfo
      }
    },
    beforeDestroy(){
      if(this.timer) clearInterval(this.timer)
      this.timer = null
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
  .settle-actions{
    display: flex;
    height: 50px;
  }
  .btn-delete,
  .btn-settle{
    height: 50px;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
    box-sizing: border-box;

    &.disabled{
      opacity: .6;
    }
  }
  .btn-delete{
    min-width: 90px;
    color: #c00000;
    background-color: white;
    border: 1px solid #c00000;
  }
  .btn-settle{
    min-width: 100px;
    color: white;
    background-color: #c00000;
  }
}
</style>
