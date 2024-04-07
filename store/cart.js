export default{
  namespaced:true,
  state(){
    return {
      // 每个商品的信息对象，都包含如下 6 个属性：
      // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
      cart:JSON.parse(uni.getStorageSync('cartStore') || '[]')
    }
  },
  mutations:{
    addCart(state, goods){
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if(!findResult){
        state.cart.push(goods)
      }else{
        findResult.goods_count++
      }
      // console.log(findResult)
      // console.log(state.cart)
      this.commit('m_cart/cartStorage')
    },
    updateGoodsState(state, goods){
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if(findResult){
        findResult.goods_state = goods.goods_state
      }
      this.commit('m_cart/cartStorage')
    },
    updateGoodsCount(state, goods){
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if(findResult){
        findResult.goods_count = goods.goods_count
      }
      this.commit('m_cart/cartStorage')
    },
    cartStorage(state){
      uni.setStorageSync('cartStore', JSON.stringify(state.cart))
    },
    removeGoods(state, goods){
      state.cart = state.cart.filter(item => item.goods_id !== goods.goods_id)
      this.commit('m_cart/cartStorage')
    },
    updateAllGoodsState(state, newState){
      state.cart.forEach(item => item.goods_state = newState)
      this.commit('m_cart/cartStorage')
    }
  },
  getters:{
    // 购物车中所有商品的总数量
    total(state){
     // let sum = 0
     //  state.cart.forEach(item => sum += item.goods_count)
     //  return sum
     
     return state.cart.reduce((sum, item) => sum += item.goods_count ,0)
    },
    //购物车中选中商品的数量
    checkedCount(state){
       return state.cart.filter(item => item.goods_state === true).reduce((sum, item) => sum += item.goods_count ,0)
    },
    //选中商品的总价
    checkedTotalPrice(state){
      return state.cart.filter(item => item.goods_state === true).reduce((sum,item) => sum += item.goods_count * item.goods_price, 0).toFixed(2)
    }
  }
}
