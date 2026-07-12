const mockOrders = [
  {
    orderNo:'202607120001',
    status:'待付款',
    createdAt:'2026-07-12 10:30',
    paymentMethod:'微信支付',
    address:{
      userName:'张同学',
      telNumber:'138****8888',
      fullAddress:'广东省深圳市南山区科技园演示路 18 号'
    },
    items:[
      {
        goods_id:90001,
        title:'无线蓝牙耳机 降噪高音质长续航',
        price:129,
        count:1,
        image:'/static/logo.png'
      }
    ],
    subtotal:129,
    shippingFee:0,
    paymentAmount:129
  },
  {
    orderNo:'202607110008',
    status:'待收货',
    createdAt:'2026-07-11 16:20',
    paymentMethod:'微信支付',
    address:{
      userName:'张同学',
      telNumber:'138****8888',
      fullAddress:'广东省深圳市南山区科技园演示路 18 号'
    },
    items:[
      {
        goods_id:90002,
        title:'产后收腹带产妇束缚带束腰带',
        price:69,
        count:2,
        image:'/static/logo.png'
      }
    ],
    subtotal:138,
    shippingFee:0,
    paymentAmount:138
  },
  {
    orderNo:'202607090003',
    status:'退款/退货',
    createdAt:'2026-07-09 09:15',
    paymentMethod:'微信支付',
    address:{
      userName:'张同学',
      telNumber:'138****8888',
      fullAddress:'广东省深圳市南山区科技园演示路 18 号'
    },
    items:[
      {
        goods_id:90003,
        title:'智能护眼台灯 学习阅读灯',
        price:89,
        count:1,
        image:'/static/logo.png'
      }
    ],
    subtotal:89,
    shippingFee:0,
    paymentAmount:89
  },
  {
    orderNo:'202607080006',
    status:'待收货',
    createdAt:'2026-07-08 14:45',
    paymentMethod:'微信支付',
    address:{
      userName:'张同学',
      telNumber:'138****8888',
      fullAddress:'广东省深圳市南山区科技园演示路 18 号'
    },
    items:[
      {
        goods_id:90004,
        title:'便携榨汁杯 USB充电随身果汁杯',
        price:59,
        count:1,
        image:'/static/logo.png'
      }
    ],
    subtotal:59,
    shippingFee:0,
    paymentAmount:59
  }
]

export default {
  namespaced:true,
  state(){
    return {
      orders:mockOrders
    }
  },
  getters:{
    orderCounts(state){
      return {
        '待付款':state.orders.filter(order => order.status === '待付款').length,
        '待收货':state.orders.filter(order => order.status === '待收货').length,
        '退款/退货':state.orders.filter(order => order.status === '退款/退货').length,
        '全部订单':state.orders.length
      }
    }
  },
  mutations:{
    markPaid(state, orderNo){
      const order = state.orders.find(item => item.orderNo === orderNo)
      if(order) order.status = '待收货'
    }
  }
}
