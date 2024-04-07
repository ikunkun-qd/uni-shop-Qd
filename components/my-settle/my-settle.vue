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
    <view @click="settlement" class="btn-settle">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import { mapGetters,mapMutations, mapState } from 'vuex';
  export default {
    name:"my-settle",
    data() {
      return {
        // 倒计时秒数
        seconds:3,
        //定义定时器id
        timer:null
      };
    },
    computed:{
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedTotalPrice']),
      ...mapGetters('m_user', ['addStr']),
      ...mapState('m_user', ['token', 'address']),
      ...mapState('m_cart', ['cart']),
      isFullChecked(){
        return this.total === this.checkedCount
      }
    },
    methods:{
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      
      isAllChecked(){
         this.updateAllGoodsState(!this.isFullChecked)
      },
      // 展示倒计时提示
      showTips(n){
        uni.showToast({
          icon:'none',
          title:'请登录后再结算！'+n+' 秒后自动跳转到登录页',
          duration:1500,
          mask:true
        })
      },
      settlement(){
        if(!this.address) return uni.$showMsg('请选择收货地址~')
        if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品~')
        if(!this.token) return this.delayNavigate()
        
        //实现微信支付功能
        this.payOrder()
      },
      delayNavigate(){
        this.seconds = 3
        this.showTips(this.seconds)
        const timer = setInterval(()=>{
          this.seconds--
          if(this.seconds <= 0){
            clearInterval(this.timer)
            uni.switchTab({
              url:'/pages/my/my',
              success:()=>{
                this.updateRedirectInfo({
                  openType:'switchTab',
                  // 从哪个页面跳转过去的
                  from:'/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      async payOrder(){
        // 准备订单的信息对象
        const orderInfo = {
       // order_price:this.checkedTotalPrice
          order_price:0.01,
          consignee_addr:this.addStr,
          goods: this.cart.filter(x => x.goods_state===true).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
        }
        
        //发送订单请求
        const {data:res} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        //判断订单是否提交成功
        if(res.meta.status !== 200) return uni.$showMsg('订单提交失败！')
  
        // 得到服务器响应的 订单编号
        const orderNumber = res.message.order_number
        
        //  订单预支付
        //  发起请求获取订单的支付信息
        const {data:res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number:orderNumber})
        // 判断是否预付订单生成失败
        if(res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
        // 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
        console.log(payInfo)
        
        // 发起微信支付
        //调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
         //未完成支付
        if (err) return uni.$showMsg('订单未支付！')
         //完成了支付，进一步查询支付的结果
        const { data: res3 } = await 
        uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: 
        orderNumber })
         //检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
         //检测到订单支付完成
        uni.showToast({
         title: '支付完成！',
         icon: 'success'
         })
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