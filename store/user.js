function readStorageObject(key, fallback){
  const storedValue = uni.getStorageSync(key)
  if(!storedValue) return fallback
  if(typeof storedValue === 'object') return storedValue

  try {
    const parsedValue = JSON.parse(storedValue)
    return parsedValue && typeof parsedValue === 'object' ? parsedValue : fallback
  } catch (error) {
    return fallback
  }
}

export default {
  namespaced:true,
  state(){
    return {
      //收货地址
      address:readStorageObject('address', {}),
      token:uni.getStorageSync('token') || '',
      // 用户的基本信息
      userinfo:readStorageObject('userinfo', {}),
      // 定义重定向对象
      redirectInfo:null
    }
  },
  mutations:{
    // 更新收货地址
    updateAddress(state, address){
      state.address = address
      this.commit('m_user/saveAddress')
    },
    //将收货地址进行本地持久化存储
    saveAddress(state){
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 更新用户的基本信息
    updateUserinfo(state, userinfo){
      state.userinfo = userinfo
      this.commit('m_user/saveUserinfo')
    },
    // 将用户的基本信息进行本地持久化存储
    saveUserinfo(state){
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    // 将请求获得的token存储
    updateToken(state, token){
      state.token = token
      this.commit('m_user/saveTokenStorage')
    },
    // 将token进行本地持久化存储
    saveTokenStorage(state){
      uni.setStorageSync('token', state.token)
    },
    // 更新重定向的信息对象
    updateRedirectInfo(state,info){
      state.redirectInfo = info
    }
  },
  getters:{
    isLoggedIn(state){
      return Boolean(state.token)
    },
    addStr(state){
      if(!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}
