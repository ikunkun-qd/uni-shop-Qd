<template>
  <view class="my-userinfo-container">
    <!-- 头像昵称区域 -->
    <view class="top-box" @click="showProfile">
      <image :src="userinfo.avatarUrl || '/static/demo-bear-avatar.png'" class="avatar"></image>
      <view class="nickname">{{userinfo.nickName || '演示用户'}}</view>
      <view class="profile-hint">点击查看个人资料</view>
    </view>

    <view class="pannel-list">
      <!-- 用户数据 -->
      <view class="pannel">
        <view class="pannel-body">
          <view
            class="pannel-item stat-item"
            v-for="(item, index) in userStats"
            :key="index"
            @click="openUserData(item.type)"
          >
            <text class="stat-number">{{item.value}}</text>
            <text>{{item.label}}</text>
          </view>
        </view>
      </view>

      <!-- 订单数据 -->
      <view class="pannel">
        <view class="pannel-title-row">
          <text class="pannel-title">我的订单</text>
          <text class="title-more" @click="openOrders('全部订单')">查看全部</text>
        </view>
        <view class="pannel-body">
          <view
            class="pannel-item order-item"
            v-for="(item, index) in orderStats"
            :key="index"
            @click="openOrders(item.status)"
          >
            <view class="order-icon-box">
              <image :src="item.icon" class="icon"></image>
              <text v-if="item.count" class="order-badge">{{item.count}}</text>
            </view>
            <text>{{item.status}}</text>
          </view>
        </view>
      </view>

      <!-- 地址、客服和登录数据 -->
      <view class="pannel">
        <view class="pannel-list-item" @click="chooseAddress">
          <view class="list-item-main">
            <text>收货地址</text>
            <text class="sub-text">{{addressText}}</text>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>

        <view class="pannel-list-item" @click="contactService">
          <view class="list-item-main">
            <text>联系客服</text>
            <text class="sub-text service-status">在线 · 5分钟内响应</text>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>

        <view class="pannel-list-item" @click="logout">
          <view class="list-item-main">
            <text>退出登录</text>
            <text class="sub-text">退出当前演示账号</text>
          </view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations, mapState } from 'vuex';
  export default {
    name:"my-userInfo",
    data() {
      return {
        mockAddress:{
          userName:'张同学',
          telNumber:'138****8888',
          provinceName:'广东省',
          cityName:'深圳市',
          countyName:'南山区',
          detailInfo:'科技园演示路 18 号'
        },
      };
    },
    computed:{
      ...mapState('m_user', ['userinfo', 'address']),
      ...mapGetters('m_order', ['orderCounts']),
      ...mapState('m_user_data', ['counts']),
      userStats(){
        return [
          { type:'shops', label:'收藏的店铺', value:this.counts.shops },
          { type:'favoriteGoods', label:'收藏的商品', value:this.counts.favoriteGoods },
          { type:'followedGoods', label:'关注的商品', value:this.counts.followedGoods },
          { type:'footprints', label:'足迹', value:this.counts.footprints }
        ]
      },
      orderStats(){
        return [
          { status:'待付款', count:this.orderCounts['待付款'], icon:'/static/my-icons/icon1.png' },
          { status:'待收货', count:this.orderCounts['待收货'], icon:'/static/my-icons/icon2.png' },
          { status:'退款/退货', count:this.orderCounts['退款/退货'], icon:'/static/my-icons/icon3.png' },
          { status:'全部订单', count:this.orderCounts['全部订单'], icon:'/static/my-icons/icon4.png' }
        ]
      },
      addressText(){
        const address = this.address && this.address.userName ? this.address : this.mockAddress
        return address.userName + ' · ' + address.provinceName + address.cityName + address.countyName
      }
    },
    methods:{
      ...mapMutations('m_user', ['updateAddress']),
      showProfile(){
        uni.showModal({
          title:this.userinfo.nickName || '演示用户',
          content:'会员等级：黄金会员\n成长值：1280\n本月已省：￥86.50\n账号状态：正常',
          showCancel:false
        })
      },
      openUserData(type){
        uni.navigateTo({
          url:'/subpkg/user_data/user_data?type=' + encodeURIComponent(type)
        })
      },
      openOrders(status){
        uni.navigateTo({
          url:'/subpkg/orders/orders?status=' + encodeURIComponent(status)
        })
      },
      async chooseAddress(){
        try {
          const result = await uni.chooseAddress()
          const err = Array.isArray(result) ? result[0] : null
          const succ = Array.isArray(result) ? result[1] : result
          if(!err && succ && succ.errMsg === 'chooseAddress:ok'){
            this.updateAddress(succ)
          }
        } catch (error) {
          const errorMessage = error && error.errMsg ? error.errMsg : ''
          if(errorMessage.indexOf('cancel') === -1){
            uni.$showMsg('收货地址选择失败，请重试')
          }
        }
      },
      contactService(){
        uni.showModal({
          title:'联系客服',
          content:'当前在线，预计 5 分钟内回复。\n演示客服：400-888-8888\n服务时间：09:00-18:00',
          showCancel:false
        })
      },
      async logout(){
        try {
          const result = await uni.showModal({
            title:'提示',
            content:'你确定要退出演示账号吗?'
          })
          const succ = Array.isArray(result) ? result[1] : result
          if(succ && succ.confirm){
            this.$store.commit('m_user/updateAddress', {})
            this.$store.commit('m_user/updateUserinfo', {})
            this.$store.commit('m_user/updateToken', '')
            uni.showToast({
              title:'已退出登录',
              icon:'success'
            })
          }
        } catch (error) {
          uni.$showMsg('退出登录失败，请重试')
        }
      }
    }
  }
</script>

<style lang="scss">
.my-userinfo-container{
  min-height: 100%;
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
    .profile-hint{
      color: rgba(255,255,255,.75);
      font-size: 12px;
      margin-top: 8px;
    }
  }
  .pannel-list{
    padding: 0 10px;
    position: relative;
    top: -10px;
    .pannel{
      background-color: white;
      border-radius: 6px;
      margin-bottom: 8px;
      overflow: hidden;
    }
    .pannel-body{
      display: flex;
      justify-content: space-around;
      .pannel-item{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        font-size: 13px;
        padding: 12px 0;
        color: #333;
      }
      .pannel-item:active{
        background-color: #fafafa;
      }
    }
    .stat-number{
      color: #c00000;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .pannel-title-row{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f4f4f4;
      padding-right: 12px;
    }
    .pannel-title{
      line-height: 45px;
      padding-left: 10px;
    }
    .title-more{
      color: #999;
      font-size: 12px;
    }
    .order-icon-box{
      position: relative;
      height: 40px;
      margin-bottom: 6px;
      .icon{
        width: 35px;
        height: 35px;
      }
      .order-badge{
        position: absolute;
        top: -5px;
        right: -12px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        padding: 0 3px;
        border-radius: 10px;
        background-color: #c00000;
        color: white;
        font-size: 10px;
        text-align: center;
        box-sizing: border-box;
      }
    }
    .pannel-list-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 58px;
      border-bottom: 1px solid #f4f4f4;
      padding: 0 10px;
      &:last-child{
        border-bottom: 0;
      }
      &:active{
        background-color: #fafafa;
      }
    }
    .list-item-main{
      display: flex;
      flex-direction: column;
      .sub-text{
        color: #999;
        font-size: 11px;
        margin-top: 4px;
      }
      .service-status{
        color: #38a169;
      }
    }
  }
}
</style>
