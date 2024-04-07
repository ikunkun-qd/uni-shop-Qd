// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from '@/store/store'

//导入网络请求的包
import { $http } from '@escook/request-miniprogram'

// 将$http挂在到uni顶级对象中
uni.$http = $http

// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

//请求拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
    title:'数据加载中...'
  })
  // console.log(options)
  // 判断有权限接口
  if(options.url.indexOf('/my') !== -1){
    options.headers = {
      Authorization:store.state.m_user.token
    }
  }
}

//响应拦截器
$http.afterRequest = function () {
  uni.hideLoading()
}

//封装弹框方法
uni.$showMsg = function(title='数据请求失败！', duration=1500){
  uni.showToast({
    icon:'none',
    title,
    duration
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif