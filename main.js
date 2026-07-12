import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from '@/store/store'
import { useUserStore } from '@/store/user.js'
import { $http } from '@escook/request-miniprogram'

const userStore = useUserStore(pinia)

// 统一配置请求能力，确保小程序端请求拦截器始终生效。
uni.$http = $http
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

$http.beforeRequest = function (options) {
  uni.showLoading({ title: '数据加载中...' })
  if (options.url.indexOf('/my') !== -1) {
    options.headers = {
      ...(options.headers || {}),
      Authorization: userStore.token
    }
  }
}

$http.afterRequest = function () {
  uni.hideLoading()
}

uni.$showMsg = function (title = '数据请求失败！', duration = 1500) {
  uni.showToast({ icon: 'none', title, duration })
}

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  return {
    app
  }
}
