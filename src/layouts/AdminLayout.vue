// 后台管理相关页面的父组件框架

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-adminPrimary">
      <q-toolbar>

        <q-btn
          :style=backBtnStyle
          flat
          @click="backBtnCallback()"
          icon="arrow_back"
        />
        <q-toolbar-title
          v-touch-hold:2000.mouse="handleHold"
          class="text-center" style="font-weight: bolder;">
          Comiru
        </q-toolbar-title>
        <q-btn
          :style=logoutBtnStyle
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
          <span class="q-ml-sm">退出管理员模式, 回到普通用户登录界面</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="adminPrimary" v-close-popup/>
          <q-btn @click="sureToLogout" flat label="确认退出" color="adminPrimary"
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
      logoutBtnStyle: ''
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
    handleHold ({ evt, ...info }) {
      this.$router.push({ path: '/admin/login' })
    },
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
    },
    sureToLogout () {
      this.signOutAndDeleteData()
    }
  }
}
</script>

<style>
</style>
