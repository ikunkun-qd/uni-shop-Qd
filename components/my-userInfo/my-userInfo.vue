<template>
   <!-- 头像昵称区域 -->
  <view class="my-userinfo-container">
    <view class="top-box">
      <image :src="userinfo.avatarUrl" class="avatar"></image>
      <view class="nickname">{{userinfo.nickName}}</view>
    </view>
    
    <!-- 第一个面板 -->
    <view class="pannel-list">
      <view class="pannel">
        <view class="pannel-body">
          <view class="pannel-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          
          <view class="pannel-item">
            <text>22</text>
            <text>收藏的商品</text>
          </view>
          <view class="pannel-item">
            <text>11</text>
            <text>关注的商品</text>
          </view>
          
          <view class="pannel-item">
            <text>199</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 第二个面板 -->
    <view class="pannel">
      <view class="pannel-title">我的订单</view>
      <view class="pannel-body">
        <view class="pannel-item">
          <image src="/static/my-icons/icon1.png" class="icon"></image>
          <text>待付款</text>
        </view>
        
        <view class="pannel-item">
          <image src="/static/my-icons/icon2.png" class="icon"></image>
          <text>待收货</text>
        </view>
        
        <view class="pannel-item">
          <image src="/static/my-icons/icon3.png" class="icon"></image>
          <text>退款/退货</text>
        </view>
        
        <view class="pannel-item">
          <image src="/static/my-icons/icon4.png" class="icon"></image>
          <text>全部订单</text>
        </view>
      </view>
    </view>
    
    <!-- 第三个面板区域 -->
    <view class="pannel">
      <view class="pannel-list-item">
        <text>收货地址</text>
        <uni-icons type="arrowright" size="15"></uni-icons>
      </view>
      
      <view class="pannel-list-item">
        <text>联系客服</text>
        <uni-icons type="arrowright" size="15"></uni-icons>
      </view>
      
      <view class="pannel-list-item" @click="logout">
        <text>退出登录</text>
        <uni-icons type="arrowright" size="15"></uni-icons>
      </view>
    
    </view>
  </view>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name:"my-userInfo",
    data() {
      return {
        
      };
    },
    computed:{
      ...mapState('m_user', ['userinfo'])
    },
    methods:{
      async logout(){
        const [err, succ] = await uni.showModal({
          title:'提示',
          content:'你确定要退出登录吗?'
        }).catch(err => err)
        if(succ && succ.confirm){
          this.$store.commit('m_user/updateAddress', {})
          this.$store.commit('m_user/updateUserinfo', {})
          this.$store.commit('m_user/updateToken', '')
          
        }
      }
    }
  }
</script>

<style lang="scss">
.my-userinfo-container{
  height: 100%;
  background-color: #f4f4f4;
  .top-box{
    height: 400rpx;
    background-color: #c00000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .avatar{
      display: block;
      width: 90px;
      height: 90px;
      border-radius: 45px;
      box-shadow: 0 1px 5px black;
      border: 2px solid white;
    }
    .nickname{
      color: white;
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
    }
  }
  .pannel-list{
    padding: 0 10px;
    position: relative;
    top: -10px;
    .pannel{
      background-color: white;
      border-radius: 3px;
      margin-bottom: 8px;
      .pannel-body{
        display: flex;
        justify-content: space-around;
        .pannel-item{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          font-size: 13px;
          padding: 10px 0;
        }
      }
    }
  }
  .pannel{
    background-color: white;
    border-radius: 3px;
    margin-bottom: 8px;
    border-bottom: 1px solid #f4f4f4;
    .pannel-title{
      line-height: 45px;
      padding-left: 10px;
      border-bottom: 1px solid #f4f4f4;
    }
    .pannel-body{
      display: flex;
      justify-content: space-around;
      .pannel-item{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        font-size: 13px;
        padding: 10px 0;

        .icon{
          width: 35px;
          height: 35px;
        }
      }
    }
  }
  .pannel-list-item{
    display: flex;
    justify-content: space-between;
    line-height: 45px;
    border-bottom: 1px solid #f4f4f4;
    padding: 0 10px;
  }
}
</style>