const mockData = {
  shops:[
    { id:1, name:'小熊官方旗舰店', category:'数码家电', fans:'12.8万粉丝', discount:'新人专享满199减20', logo:'/static/user-data/shop-electronics.jpg' },
    { id:2, name:'优选家居生活馆', category:'家居生活', fans:'8.6万粉丝', discount:'每周三会员日', logo:'/static/user-data/shop-home.jpg' },
    { id:3, name:'轻食健康研究所', category:'食品酒水', fans:'6.2万粉丝', discount:'满99包邮', logo:'/static/user-data/shop-food.jpg' },
    { id:4, name:'潮流运动装备店', category:'运动户外', fans:'5.4万粉丝', discount:'部分商品低至5折', logo:'/static/user-data/shop-sports.jpg' },
    { id:5, name:'宝宝成长优选店', category:'母婴用品', fans:'3.9万粉丝', discount:'关注店铺送积分', logo:'/static/user-data/shop-baby.jpg' },
    { id:6, name:'美妆护肤集合店', category:'美妆洗护', fans:'9.1万粉丝', discount:'品牌专享券', logo:'/static/user-data/shop-beauty.jpg' }
  ],
  favoriteGoods:[
    { goods_id:43986, title:'海信 55英寸4K超高清量子点电视', price:13999, oldPrice:15999, sales:'已售 328', tag:'降价 2000 元', image:'/static/user-data/tv.jpg' },
    { goods_id:43987, title:'无线蓝牙耳机 降噪高音质长续航', price:129, oldPrice:169, sales:'已售 2.1万', tag:'限时特价', image:'/static/user-data/earbuds.jpg' },
    { goods_id:43988, title:'智能护眼台灯 学习阅读灯', price:89, oldPrice:119, sales:'已售 8600+', tag:'自营', image:'/static/user-data/lamp.jpg' },
    { goods_id:43989, title:'便携榨汁杯 USB充电随身果汁杯', price:59, oldPrice:79, sales:'已售 1.3万', tag:'新品', image:'/static/user-data/juicer.jpg' },
    { goods_id:43990, title:'轻薄羽绒服 女士秋冬保暖外套', price:299, oldPrice:399, sales:'已售 5600+', tag:'收藏加购', image:'/static/user-data/jacket.jpg' },
    { goods_id:43991, title:'多功能电煮锅 宿舍家用一体锅', price:79, oldPrice:99, sales:'已售 9800+', tag:'好评率 98%', image:'/static/user-data/pot.jpg' }
  ],
  followedGoods:[
    { goods_id:43992, title:'产后收腹带产妇束缚带束腰带', price:69, oldPrice:89, sales:'已售 4300+', tag:'补货提醒', image:'/static/user-data/belt.jpg' },
    { goods_id:43993, title:'智能扫地机器人 全自动吸尘拖地', price:899, oldPrice:1099, sales:'已售 2100+', tag:'降价提醒', image:'/static/user-data/vacuum.jpg' },
    { goods_id:43994, title:'通勤双肩电脑包 防水大容量', price:99, oldPrice:129, sales:'已售 7600+', tag:'上新提醒', image:'/static/user-data/backpack.jpg' },
    { goods_id:43995, title:'护颈记忆棉枕头 午睡枕', price:49, oldPrice:69, sales:'已售 1.8万', tag:'降价提醒', image:'/static/user-data/pillow.jpg' },
    { goods_id:43996, title:'男士休闲运动鞋 透气轻便', price:159, oldPrice:199, sales:'已售 3200+', tag:'库存充足', image:'/static/user-data/sneakers.jpg' }
  ],
  footprints:[
    { goods_id:43986, title:'海信 55英寸4K超高清量子点电视', price:13999, oldPrice:15999, sales:'昨天浏览', tag:'继续选购', image:'/static/user-data/tv.jpg' },
    { goods_id:43987, title:'无线蓝牙耳机 降噪高音质长续航', price:129, oldPrice:169, sales:'今天 10:30', tag:'你可能喜欢', image:'/static/user-data/earbuds.jpg' },
    { goods_id:43988, title:'智能护眼台灯 学习阅读灯', price:89, oldPrice:119, sales:'昨天 18:20', tag:'还有库存', image:'/static/user-data/lamp.jpg' },
    { goods_id:43992, title:'产后收腹带产妇束缚带束腰带', price:69, oldPrice:89, sales:'07月10日', tag:'近期热卖', image:'/static/user-data/belt.jpg' },
    { goods_id:43989, title:'便携榨汁杯 USB充电随身果汁杯', price:59, oldPrice:79, sales:'07月09日', tag:'买家好评', image:'/static/user-data/juicer.jpg' },
    { goods_id:43991, title:'多功能电煮锅 宿舍家用一体锅', price:79, oldPrice:99, sales:'07月08日', tag:'相似推荐', image:'/static/user-data/pot.jpg' }
  ]
}

const mockCounts = Object.keys(mockData).reduce((counts, type) => {
  counts[type] = mockData[type].length
  return counts
}, {})

export default {
  namespaced:true,
  state(){
    return {
      data:mockData,
      counts:mockCounts
    }
  }
}
