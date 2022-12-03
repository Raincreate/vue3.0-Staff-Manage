<script >
import TreeMenu from './TreeMenu.vue'
import BreadCard from './BreadCard.vue';
  export default{
    name:'home',
    components:{
      TreeMenu,
      BreadCard,
    },
    data(){
      return {
        userInfo:this.$store.state.userInfo,
        isCollapse: false,
        noticeCount:0,
        userMenu:[],

      }
    },
    mounted(){
      this.getNoticeCount(),
      this.getMenuList()
    },
    methods: {
      handleDrop(item) {
        console.log('aaa',item);
        if(item === 'email') return
        this.$store.commit('saveUserInfo','')
        this.userInfo = null
        this.$router.push('/login')
      },
      isFold(){
        this.isCollapse = !this.isCollapse
      },
      async getNoticeCount(){
        const res = await this.$api.noticeCount()
        this.noticeCount = res
      },
      async getMenuList(){
        const res = await this.$api.MenuList()
        this.userMenu = res
      }
    }
  };
</script>

<template>
  <div class="basic-layout">
    <div :class="['nav-side',isCollapse ? 'fold' : 'unfold']">
      <img src="../assets/vue-img.png" alt="" class="nav-img">
      <div class="nav-word">员工管理系统</div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        router
        :collapse="isCollapse"
      >
        <tree-menu :userMenu="userMenu"/>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <el-icon><fold class="menu-fold" @click="isFold"></fold></el-icon>
          <div class="bread">
            <BreadCard/>
          </div>
        </div>
        
        <div class="user-info">
          <el-badge :is-dot="(noticeCount > 0 ? true : false)" class="user-badge">
            <el-icon class="user-icon"><bell></bell></el-icon>
          </el-badge>
          <el-dropdown @command="handleDrop">
            <span class="user-dropDown">
              {{userInfo.userName}}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱:{{userInfo.userEmail}}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.basic-layout{
  position: relative;
  .nav-side{
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: white;
    overflow-y: auto;
    transition: width 0.5s;
    .nav-img{
      width: 100%;
      height: 80px;
      margin-right: 25px;
    }
    .nav-word{
      font-size: 32px;
      font-family: cursive;
    }
    &.fold{
      width: 64px;
    }
    &.unfold{
      width: 200px;
    }
  }
  .content-right{
    margin-left: 200px;
    &.fold{
      margin-left: 64px;
    }
    &.unfold{
      margin-left: 200px;
    }
    .nav-top{
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;

      .nav-left{
        display: flex;
        align-items: center;
        .menu-fold{
          width: 42px;

        }
      }
      .user-info{
        .user-dropDown{
          margin-top: 15px;
          cursor: pointer;
        }
        .user-badge{
          line-height: 30px;
          margin-right: 10px;
        }
      }
    }
    .wrapper{
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page{
        height: 100%;
        background-color: #fff;
      }
    }
  }
}
</style>
