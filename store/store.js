import Vue from 'vue'
import Vuex from 'vuex'
import cart from '@/store/cart'
import user from '@/store/user.js'
import order from '@/store/order.js'
import userData from '@/store/user-data.js'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules:{
    m_cart:cart,
    m_user:user,
    m_order:order,
    m_user_data:userData
  }
})

export default store
