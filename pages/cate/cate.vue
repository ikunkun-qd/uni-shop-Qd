<template>
  <view>
    <my-search @search="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滑动区 -->
      <scroll-view class="scroll-view-left" scroll-y="true" :style="{height:wh+'px'}">
        <block v-for="(item,index) in cateList" :key="index">
          <view @click="getActive(index)" :class="['scroll-view-left-item', active === index ? 'active' : '']">{{item.cat_name}}</view>
        </block>
        
      </scroll-view>
      
      <!-- 右侧滑动区 -->
      <scroll-view scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <!-- 二级分类标题 -->
         <view class="cate-lv2-title">
           {{item2.cat_name}}
         </view> 
         
         <!-- 三级分类 -->
         <view class="cate-lv3-list">
           <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
             <image :src="item3.cat_icon"></image>
             <text>{{item3.cat_name}}</text>
           </view>
         </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh:0,
        cateList:[],
        active:0,
        cateLevel2:[],
        scrollTop:0
      };
    },
    methods:{
      async getCateList(){
        const {data:res} = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        this.cateLevel2 = res.message[0].children
      },
      getActive(i){
        this.active = i
        this.cateLevel2 = this.cateList[i].children
        
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      gotoGoodsList(item){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      },
      gotoSearch(){
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      }
    },
    onLoad() {
      const windowInfo = uni.getWindowInfo()
      this.wh = windowInfo.windowHeight - 50
      
      this.getCateList()
    }
  }
</script>

<style lang="scss">
.cate-lv3-list{
  display:flex;
  flex-wrap:wrap;
  .cate-lv3-item{
    width: 33.33%;
    flex-direction:column;
    display:flex;
    justify-content:center;
    align-items:center;
    margin-bottom:10px
  }
    image{
      width: 60px;
      height: 60px;
    }
    text{
      font-size:12px;
    }
}
.scroll-view-container{
  display: flex;
}
.scroll-view-left{
  width: 120px;
}
.cate-lv2-title{
  text-align: center;
  font-weight:bold;
  font-size: 12px;
  padding:15px, 0;
}
.scroll-view-left-item{
  background-color: #F7F7F7;
  text-align: center;
  line-height: 60px;
  font-size: 12px;
  
  &.active{
    background-color: #FFFFFF;
      position: relative;
    
    &::before{
      content: '';
      display: block;
      width: 3px;
      height: 30px;
      background-color: #c00000;
      position: absolute;
      top: 50%;
      left: 0%;
      transform: translateY(-50%);
    }
  }
}
</style>
