<template>
  <view>
    <view class="goods-list">
      <view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)" >
        <my-goods :item="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

const queryObj = reactive({
  query: '',
  cid: '',
  pagenum: 1,
  pageSize: 10
})
const goodsList = ref([])
const total = ref(0)
const isLoading = ref(false)

async function getGoodsList(callback) {
  isLoading.value = true
  const { data: res } = await uni.$http.get('/api/public/v1/goods/search', queryObj)
  isLoading.value = false
  if (callback) callback()
  if (res.meta.status !== 200) return uni.$showMsg()
  goodsList.value = [...goodsList.value, ...res.message.goods]
  total.value = res.message.total
}

function gotoDetail(item) {
  uni.navigateTo({
    url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
  })
}

onLoad((option) => {
  queryObj.query = option.query || ''
  queryObj.cid = option.cid || ''
  getGoodsList()
})

onPullDownRefresh(() => {
  queryObj.pagenum = 1
  total.value = 0
  isLoading.value = false
  goodsList.value = []
  getGoodsList(() => uni.stopPullDownRefresh())
})

onReachBottom(() => {
  if (queryObj.pagenum * queryObj.pageSize >= total.value) return uni.$showMsg('数据加载完毕！')
  if (isLoading.value) return
  queryObj.pagenum++
  getGoodsList()
})
</script>

<style lang="scss">

</style>
