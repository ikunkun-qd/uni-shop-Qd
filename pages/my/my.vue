<template>
  <view>
    <!-- 登录组件 -->
    <my-login v-if="!token" ></my-login>
    
    <!-- 用户信息组件 -->
    <my-userInfo v-else class="my-container"></my-userInfo>
    
  </view>
</template>

<script>
  import mixBadge from '@/mixins/tabbar-badge.js'
  import { mapState } from 'vuex';
  export default {
    mixins:[mixBadge],
    data() {
      return {
        
      };
    },
    computed:{
      ...mapState('m_user', ['token'])
    }
  }
</script>

<style lang="scss">
.my-container{
  height: 100%;
}
</style>
