import { defineStore } from 'pinia'

function readStorageObject(key, fallback) {
  const storedValue = uni.getStorageSync(key)
  if (!storedValue) return fallback
  if (typeof storedValue === 'object') return storedValue

  try {
    const parsedValue = JSON.parse(storedValue)
    return parsedValue && typeof parsedValue === 'object' ? parsedValue : fallback
  } catch (error) {
    return fallback
  }
}

function normalizeUserinfo(userinfo) {
  if (userinfo && userinfo.avatarUrl === '/static/demo-bear-avatar.webp') {
    return Object.assign({}, userinfo, {
      avatarUrl: '/static/demo-bear-avatar.png'
    })
  }
  return userinfo
}

export const useUserStore = defineStore('user', {
  state: () => ({
    // 收货地址
    address: readStorageObject('address', {}),
    token: uni.getStorageSync('token') || '',
    // 用户的基本信息
    userinfo: normalizeUserinfo(readStorageObject('userinfo', {})),
    // 定义重定向对象
    redirectInfo: null
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    addStr: (state) => {
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  },
  actions: {
    updateAddress(address) {
      this.address = address
      this.saveAddress()
    },
    saveAddress() {
      uni.setStorageSync('address', JSON.stringify(this.address))
    },
    updateUserinfo(userinfo) {
      this.userinfo = userinfo
      this.saveUserinfo()
    },
    saveUserinfo() {
      uni.setStorageSync('userinfo', JSON.stringify(this.userinfo))
    },
    updateToken(token) {
      this.token = token
      this.saveTokenStorage()
    },
    saveTokenStorage() {
      uni.setStorageSync('token', this.token)
    },
    updateRedirectInfo(info) {
      this.redirectInfo = info
    }
  }
})
