// 用户认证相关页面的父组件框架

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>

        <q-btn
          flat
          @click="backBtnCallback()"
          icon="arrow_back"
        />
        <q-toolbar-title class="text-center" style="font-weight: bolder;">
          Comiru
        </q-toolbar-title>
        <q-btn flat @click="confirm = true">
          <q-icon right name="logout"/>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>

    </q-page-container>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">登出当前帐号, 您可能需要重新登录后才能使用所有功能</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup/>
          <q-btn @click="sureToLogout" flat label="确认登出" color="primary"
                 v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>

</template>

<script>

export default {
  name: 'AuthLayout',
  data () {
    return {
      confirm: false,
      name: null,
      age: null,
      showBackBtn: false,
      accept: false,
      isPwd: true,
      password: null,
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.path === '/auth/switch') {
      console.log('switch now')
      this.showBackBtn = false
    } else {
      this.showBackBtn = true
    }
    next()
  },
  methods: {
    backBtnCallback () {
      if (this.$route.path === '/auth/switch') {
        this.$router.push({ path: '/auth/login' })
      } else if (this.$route.path === '/auth/bind_register') {
        this.$router.push({ path: '/auth/bind_login' })
      } else if (this.$route.path === '/auth/register') {
        this.$router.push({ path: '/auth/login' })
      } else {
        this.$router.push({ path: '/auth/switch' })
      }
    },
    sureToLogout () {
      this.signOutAndDeleteData()
    }
  }
}
</script>

<style>
</style>
