export default {
  namespaced:true,
  state(){
    return {
      //收货地址
      address:JSON.parse(uni.getStorageSync('address') || '{}'),
      token:uni.getStorageSync('token') || 'u12u3uiu31uhu999s0seeueuss$$566&&qq12',
      // 用户的基本信息
      userinfo:JSON.parse(uni.getStorageSync('userinfo') || '{}'),
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
    addStr(state){
      if(!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}