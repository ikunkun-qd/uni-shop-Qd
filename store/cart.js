import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cartStore') || '[]')
  }),
  getters: {
    // 购物车中所有商品的总数量
    total: (state) => state.cart.reduce((sum, item) => sum + item.goods_count, 0),
    // 购物车中选中商品的数量
    checkedCount: (state) => state.cart
      .filter(item => item.goods_state === true)
      .reduce((sum, item) => sum + item.goods_count, 0),
    // 选中商品的总价
    checkedTotalPrice: (state) => state.cart
      .filter(item => item.goods_state === true)
      .reduce((sum, item) => sum + item.goods_count * item.goods_price, 0)
      .toFixed(2)
  },
  actions: {
    addCart(goods) {
      const findResult = this.cart.find(item => item.goods_id === goods.goods_id)
      if (!findResult) {
        this.cart.push(goods)
      } else {
        findResult.goods_count++
      }
      this.cartStorage()
    },
    updateGoodsState(goods) {
      const findResult = this.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
      }
      this.cartStorage()
    },
    updateGoodsCount(goods) {
      const findResult = this.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
      }
      this.cartStorage()
    },
    cartStorage() {
      uni.setStorageSync('cartStore', JSON.stringify(this.cart))
    },
    removeGoods(goods) {
      this.cart = this.cart.filter(item => item.goods_id !== goods.goods_id)
      this.cartStorage()
    },
    removeCheckedGoods() {
      this.cart = this.cart.filter(item => item.goods_state !== true)
      this.cartStorage()
    },
    updateAllGoodsState(newState) {
      this.cart.forEach(item => { item.goods_state = newState })
      this.cartStorage()
    }
  }
})
