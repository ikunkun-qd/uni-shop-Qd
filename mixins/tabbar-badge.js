import { mapGetters } from 'vuex';
export default{
  computed:{
    ...mapGetters('m_cart', ['total'])
  },
  watch:{
    total:{
      handler(newValue){
        this.setBadge(newValue)
      },
      immediate:true
    }
  },
  onShow() {
    this.setBadge()
  },
  methods:{
    setBadge(){
      uni.setTabBarBadge({
        index:2,
        text:this.total + ''
      })
      if(this.total===0){
        uni.removeTabBarBadge({index:2})
      }
    }
  }
}