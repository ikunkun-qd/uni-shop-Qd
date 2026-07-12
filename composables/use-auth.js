import { useUserStore } from '@/store/user.js'

export function useAuth() {
  const userStore = useUserStore()

  function requireLogin(redirectUrl) {
    if (userStore.token) return true

    userStore.updateRedirectInfo({
      openType: 'switchTab',
      from: redirectUrl
    })
    uni.showToast({
      title: '请先登录后再操作',
      icon: 'none'
    })
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/my/my'
      })
    }, 500)
    return false
  }

  return { requireLogin }
}
