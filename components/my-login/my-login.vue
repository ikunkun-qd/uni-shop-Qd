<template>
  <view class="login-container">
    <image class="login-avatar" src="/static/demo-bear-avatar.png"></image>
    <button type="primary" class="login-btn" @click="demoLogin">一键登录</button>
    <text class="login-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';
  export default {
    name:"my-login",
    computed:{
      ...mapState('m_user', ['redirectInfo'])
    },
    methods:{
      ...mapMutations('m_user', ['updateRedirectInfo', 'updateToken', 'updateUserinfo']),
      demoLogin(){
        this.updateUserinfo({
          avatarUrl:'/static/demo-bear-avatar.png',
          nickName:'演示用户'
        })
        this.updateToken('demo-token')

        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
          const redirectUrl = this.redirectInfo.from
          this.updateRedirectInfo(null)
          uni.switchTab({
            url:redirectUrl
          })
          return
        }

        uni.showToast({
          title:'登录成功',
          icon:'success'
        })
      }
    }
  }
</script>

<style lang="scss">
.login-container{
  height: 750rpx;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .login-avatar{
    width: 100px;
    height: 100px;
    border-radius: 50px;
    margin-bottom: 20px;
  }
  .login-btn{
    margin: 10px 0;
    width: 90%;
    border-radius: 100px;
    background-color: #c00000;
  }
  .login-text{
    font-size: 12px;
    color: gray;
  }
}
</style>
