// 用户认证相关页面的父组件框架

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>

        <q-btn
          :style=backBtnStyle
          flat
          @click="backBtnCallback()"
          icon="arrow_back"
        />
        <q-toolbar-title class="text-center" style="font-weight: bolder;">
          Comiru
        </q-toolbar-title>
        <q-btn
          :style=backBtnStyle
          flat @click="confirm = true">
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
      backBtnStyle: 'visibility: hidden',
      logoutBtnStyle: 'visibility: hidden'
    }
  },
  mounted () {
    if (this.$route.path === '/auth/switch') {
      this.showBackBtn()
      this.showLogoutBtn()
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.path === '/auth/login') {
      this.hideBackBtn()
      this.hideLogoutBtn()
    }

    if (to.path === '/auth/switch') {
      this.showLogoutBtn()
      this.showBackBtn()
    }
    next()
  },
  methods: {
    showBackBtn () {
      this.backBtnStyle = ''
    },
    hideBackBtn () {
      this.backBtnStyle = 'visibility: hidden'
    },
    showLogoutBtn () {
      this.logoutBtnStyle = ''
    },
    hideLogoutBtn () {
      this.logoutBtnStyle = 'visibility: hidden'
    },
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
