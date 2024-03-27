<template>
  <view>
    <view class="goods-list">
      <view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)" >
        <my-goods :item="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj:{
          query:'',
          cid:'',
          pagenum:1,
          pageSize:10
        },
        goodsList:[],
        total:0,
        isLoading:false
      };
    },
    onLoad(option) {
      // console.log(option)
      this.queryObj.query = option.query || ''
      this.queryObj.cid = option.cid || ''
      // console.log(this.queryObj)
      this.getGoodsList()
    },
    methods:{
      async getGoodsList(cb){
        this.isLoading = true
        const {data:res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        this.isLoading = false
        cb && cb()
        if(res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    onPullDownRefresh() {
      this.queryObj.pagenum = 1,
      this.total = 0,
      this.isLoading = false
      this.goodsList = []
      
      this.getGoodsList(()=>uni.stopPullDownRefresh())
    },
    onReachBottom() {
      if(this.queryObj.pagenum * this.queryObj.pageSize >= this.total) return uni.$showMsg('数据加载完毕！')
      
      if(this.isLoading) return
      
      this.queryObj.pagenum++
      this.getGoodsList()
    }
  }
</script>

<style lang="scss">

</style>
