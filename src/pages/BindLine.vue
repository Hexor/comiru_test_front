// 在新窗口中登录 Line 成功后, 服务器会携带相关认证信息访问本页, 从而将认证信息保存到 Localstorage

<template>
  <div class="q-pa-md absolute-center" style=" max-width: 500px">
        <div class="text-subtitle1">正在绑定 Line, 请稍等...</div>
  </div>
</template>

<script>
export default {
  name: 'BindLine',
  props: {
    access_token: String,
    expires_in: String
  },
  created () {
    this.$q.localStorage.set('line_access_token', this.access_token)
    const nowTS = new Date()
    this.$q.localStorage.set('line_token_expire_at', nowTS.getTime() +
        this.expires_in * 1000)
    window.close()
  }
}
</script>

<style>
</style>
