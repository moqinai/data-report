<template>
  <a-form ref="loginForm" :form="form" id="login-form" @submit="handleSubmit" class="login-form">
    <a-form-item>
      <a-input placeholder="用户名" type="userName"
        v-decorator="['userName', {rules: [{required: true, message: '请输入用户名'}]}]"
      >
        <a-icon slot="prefix" type="user" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input placeholder="密码"
        type="password"
        v-decorator="['password', {rules: [{required: true, message: '请输入密码'}]}]"
      >
        <a-icon slot="prefix" type="lock" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" class="login-form-button" htmlType="submit">登录</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  export default {
    name: 'loginForm',
    beforeCreate () {
       this.form = this.$form.createForm(this) // ant 自带的
    },
    created () {},
    // 方法
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => { // 校验
        if (!err) {
          // set("token", values);
          this.$router.push({ path: '/home' })
        }
      })
    }
    // 计算属性get
 }
</script>

<style lang='scss' scoped>
  #login-form {
    i {
      color: rgba(0, 0, 0, .25)
    }
    .login-form-button {
      width: 100%
    }
  }
</style>
