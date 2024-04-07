<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="login-btn" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <text class="login-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    computed:{
      ...mapState('m_user',['redirectInfo'])
    },
    methods:{
      ...mapMutations('m_user', ['updateRedirectInfo', 'updateToken']),
      getUserInfo(e){
        // console.log(e.detail)
        this.$store.commit('m_user/updateUserinfo', e.detail.userInfo)
        this.getToken(e.detail)
      },
      async getToken(info){
        const [err, res] = await uni.login().catch(err => err)
        // console.log(res.code)
        // console.log(info)
        if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
         // 判断 vuex 中的 redirectInfo 是否为 null
         // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()
        
        //准备参数
        const query = {
          code:res.code,
          encryptedData:info.encryptedData,
          iv:info.iv,
          rawData:info.rawData,
          signature:info.signature,
        }
        
        const {data:loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // console.log(loginResult)
        if(loginResult.meta.status !== 400) return uni.$showMsg('登录失败！')
        // 将用户的token存储到 vuex 中
        // this.$store.commit('m_user/updateToken', loginResult.message.token)
        this.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o")

      },
      // 返回登录之前的页面
      navigateBack(){
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
          uni.switchTab({
            // 要导航到的页面地址
            url:this.redirectInfo.from,
             // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
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