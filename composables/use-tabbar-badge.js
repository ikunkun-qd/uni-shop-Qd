import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart.js'

export function useTabbarBadge() {
  const cartStore = useCartStore()
  const { total } = storeToRefs(cartStore)

  function setBadge() {
    uni.setTabBarBadge({
      index: 2,
      text: String(total.value)
    })
    if (total.value === 0) {
      uni.removeTabBarBadge({ index: 2 })
    }
  }

  onShow(setBadge)
  setBadge()

  return { total }
}
