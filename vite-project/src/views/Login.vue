<script >
import {User,View} from '@element-plus/icons-vue'
export default{
  name:'login',
  data(){
    return {
      user:{
        userName:'',
        userPwd:''
      },
      rules:{
        userName:[{ required : true , message:'请输入用户名' , trigger:'blur'}],
        userPwd:[{ required : true , message:'请输入密码' , trigger:'blur'}],
      }
    }
  },
  methods:{
    goHome() {
      this.$router.push('/welcome');
    },
    login(){
      this.$refs.loginOut.validate((res)=>{
        // console.log(res);
        if(res){
          this.$api.login(this.user).then((res)=>{
          // console.log(res);
          this.$store.commit('saveUserInfo',res)
          this.$router.push('/welcome')
        })
        }
      })
    }
  },
  computed:{
    users(){
      return User
    },
    view(){
      return View
    }
  },
  mounted(){
    // this.$request({
    //   method:'get',
    //   url:'/login',
    //   data:{
    //     name:'Rain',
    //   },
    // }).then((res)=>{
    //   console.log('login:res ',res);
    // })
    // this.$request.get('/login',{name:'Rain'},{mock:true}).then((res)=>{
    //   console.log(res);
    // });
    // this.$storage.setItem('user',{name:'rain',password:'123456'})

  },
};
</script>

<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form :model="user" :rules="rules" state-icon ref="loginOut">
        <div class="title">登录页</div>
        <el-form-item prop="userName">
          <el-input type="text" :prefix-icon="users" v-model="user.userName"></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" :prefix-icon="view" v-model="user.userPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  class="btn-login" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.login-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal{
    width: 500px;
    padding: 35px;
    background: #fff;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title{
      font-size: 15px;
      line-height: 1.5;
      text-align: center;
    }
    .btn-login{
      width: 100%;
    }
  }
}
</style>
