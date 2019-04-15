<template>
  <div class="login">
    <div class="login-con">
      <a-card title="登录" :bordered="false">
        <loginForm></loginForm> 
        <p class="login-tip">输入用户名和密码</p>
      </a-card>
    </div>
  </div>
</template>

<script>
  import loginForm from './login-form.vue'

  export default {
    name: 'login',
    created () {

    },
    components: {
      loginForm
    }
 }
</script>

<style scoped lang="scss">
  .login{
    width: 100%;
    height: 100%;
    background-image: url('../../assets/img/login-bg.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    .login-con{
        position: absolute;
        right: 160px;
        top: 50%;
        transform: translateY(-60%);
        width: 300px;
        .login-con-header{
            font-size: 16px;
            font-weight: 300;
            text-align: center;
            padding: 30px 0;
        }
        .form-con{
            padding: 10px 0 0;
        }
        .login-tip{
            font-size: 10px;
            text-align: center;
            color: #c3c3c3;
        }
    }
}
</style>
