<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio">
      <radio @click="isAllChecked" :checked="isFullChecked" color="#2f766d" /><text>全选</text>
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

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart.js'
import { useUserStore } from '@/store/user.js'

const cartStore = useCartStore()
const userStore = useUserStore()
const { checkedCount, total, checkedTotalPrice, cart } = storeToRefs(cartStore)
const { addStr, token, address } = storeToRefs(userStore)
const seconds = ref(3)
const timer = ref(null)
const isSubmitting = ref(false)
const isFullChecked = computed(() => total.value === checkedCount.value)
const hasAddress = computed(() => Boolean(
  address.value &&
  address.value.userName &&
  address.value.telNumber &&
  addStr.value
))

function isAllChecked() {
  cartStore.updateAllGoodsState(!isFullChecked.value)
}

function removeSelected() {
  if (!checkedCount.value) return uni.$showMsg('请选择要删除的商品~')

  uni.showModal({
    title: '批量删除',
    content: '确定删除选中的商品吗？',
    success: (res) => {
      if (res.confirm) cartStore.removeCheckedGoods()
    }
  })
}

function showTips(n) {
  uni.showToast({
    icon: 'none',
    title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
    duration: 1500,
    mask: true
  })
}

function settlement() {
  if (isSubmitting.value) return
  if (!hasAddress.value) return uni.$showMsg('请选择收货地址~')
  if (!checkedCount.value) return uni.$showMsg('请选择要结算的商品~')
  if (!token.value) return delayNavigate()
  payOrder()
}

function delayNavigate() {
  if (timer.value) clearInterval(timer.value)
  seconds.value = 3
  showTips(seconds.value)
  timer.value = setInterval(() => {
    seconds.value--
    if (seconds.value <= 0) {
      clearInterval(timer.value)
      timer.value = null
      userStore.updateRedirectInfo({
        openType: 'switchTab',
        from: '/pages/cart/cart'
      })
      uni.switchTab({ url: '/pages/my/my' })
      return
    }
    showTips(seconds.value)
  }, 1000)
}

function payOrder() {
  isSubmitting.value = true
  // 面试演示使用本地订单，不调用真实支付接口。
  const orderInfo = {
    order_price: Number(checkedTotalPrice.value),
    consignee_addr: addStr.value,
    goods: cart.value
      .filter(item => item.goods_state === true)
      .map(item => ({
        goods_id: item.goods_id,
        goods_number: item.goods_count,
        goods_price: item.goods_price
      }))
  }

  uni.showLoading({ title: '订单提交中...' })
  setTimeout(() => {
    uni.hideLoading()
    cartStore.removeCheckedGoods()
    isSubmitting.value = false
    uni.showToast({
      title: '支付成功（演示）',
      icon: 'success'
    })
  }, 500)

  return orderInfo
}

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
  timer.value = null
})
</script>

<style lang="scss">
.my-settle-container{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 58px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 -6rpx 20rpx rgba(31, 71, 66, .08);
  font-size: 14px;

  .radio{
    display: flex;
    align-items: center;
  }
  .amount-box{
    .amount{
      color: #e58b4b;
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
    color: #2f766d;
    background-color: white;
    border: 1px solid #2f766d;
  }
  .btn-settle{
    min-width: 100px;
    color: white;
    background-color: #2f766d;
  }
}
</style>
