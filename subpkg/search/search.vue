<template>
  <view>
    <view class="search-box">
      <uni-search-bar cancelButton="none" :radius="100" @input="input" :focus="true"></uni-search-bar>
    </view>
    
    <!-- 建议列表 -->
    <view class="sugg-list" v-if="searchList.length !== 0">
      <view class="sugg-item" v-for="(item,i) in searchList" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrow-right" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="23" @click="clean"></uni-icons>
      </view>
      
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag @click="gotoGoodsList(item)" :text="item" v-for="(item, i) in histories" :key="i"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer:null,
        kw:'',
        searchList:[],
        historyList:[]
      };
    },
    computed:{
      histories(){
        return [...this.historyList].reverse()
      }
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw' || []))
    },
    methods:{
      input(e){
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          this.kw = e
          this.getSearchList()
        }, 1000)
      },
      async getSearchList(){
      if(this.kw === ''){
        this.searchList = []
        return
      }
      const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query:this.kw})
      if(res.meta.status !== 200) return uni.$showMsg()
      this.searchList = res.message
      this.saveSearchList()
      },
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      saveSearchList(){
       // this.historyList.push(this.kw)
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        
        // 本地持久化
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      clean(){
        this.historyList = []
        uni.setStorageSync('kw', [])
      },
      gotoGoodsList(goods_name){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query=' + goods_name
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box{
    position: sticky;
    top: 0%;
    z-index: 999;
  }
  .sugg-list{
    padding: 0 15px;
    .sugg-item{
      font-size: 15px;
      padding: 30px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #efefef;
      .goods-name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }
  .history-box{
    margin: 0px 5px;
    .history-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #efefef;
      margin: 5px 5px;
      height: 40px;
      font-size: 16px;
    }
    .history-list{
      display: flex;
      flex-wrap: wrap;
        uni-tag{
          margin: 5px 5px;
        }
    }
  }
</style>
