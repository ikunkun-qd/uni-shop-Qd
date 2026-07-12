import { mapState } from 'vuex'

export default {
  computed:{
    ...mapState('m_user', ['token'])
  },
  methods:{
    requireLogin(redirectUrl){
      if(this.token) return true

      this.$store.commit('m_user/updateRedirectInfo', {
        openType:'switchTab',
        from:redirectUrl
      })
      uni.showToast({
        title:'请先登录后再操作',
        icon:'none'
      })
      setTimeout(()=>{
        uni.switchTab({
          url:'/pages/my/my'
        })
      }, 500)
      return false
    }
  }
}
