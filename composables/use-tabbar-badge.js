import { onShow } from '@dcloudio/uni-app'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart.js'

let lastBadgeText = ''

const tabBarRoutes = new Set([
  'pages/home/home',
  'pages/cate/cate',
  'pages/cart/cart',
  'pages/my/my'
])

export function useTabbarBadge() {
  const cartStore = useCartStore()
  const { total } = storeToRefs(cartStore)

  function isTabBarPage() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const route = currentPage?.route || currentPage?.$page?.route || ''
    return tabBarRoutes.has(route)
  }

  function syncBadge() {
    if (!isTabBarPage()) return

    const nextBadgeText = total.value > 0 ? String(total.value) : ''
    if (nextBadgeText === lastBadgeText) return

    lastBadgeText = nextBadgeText
    if (nextBadgeText) {
      const setResult = uni.setTabBarBadge({
        index: 2,
        text: nextBadgeText
      })
      if (setResult && typeof setResult.catch === 'function') setResult.catch(() => {})
    } else {
      const removeResult = uni.removeTabBarBadge({ index: 2 })
      if (removeResult && typeof removeResult.catch === 'function') removeResult.catch(() => {})
    }
  }

  onShow(syncBadge)
  watch(total, syncBadge)
  syncBadge()

  return { total }
}
