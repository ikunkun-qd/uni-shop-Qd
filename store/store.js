import Vue from 'vue'
import Vuex from 'vuex'
import cart from '@/store/cart'
import user from '@/store/user.js'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules:{
    m_cart:cart,
    m_user:user
  }
})

export default store