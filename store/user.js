export default {
  namespaced:true,
  state(){
    return {
      address:JSON.parse(uni.getStorageSync('address') || '{}')
    }
  },
  mutations:{
    // 更新收货地址
    updateAddress(state, address){
      state.address = address
      this.commit('m_user/saveAddress')
    },
    //将数据进行本地持久化存储
    saveAddress(state){
      uni.setStorageSync('address', JSON.stringify(state.address))
    }
  },
  getters:{
    addStr(state){
      if(!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}