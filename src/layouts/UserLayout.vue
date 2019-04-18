// 学员和教师相关页面的父组件框架

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu"/>
        </q-btn>

        <q-toolbar-title>
          Comiru
        </q-toolbar-title>
        <!--<q-avatar >-->
        <!--<q-img style="width:28px; height: 28px"-->
        <!--src="/assets/logo.png"></q-img>-->
        <!--</q-avatar>-->

        <!--<div>Quasar v{{ $q.version }}</div>-->
      </q-toolbar>
    </q-header>

    <q-drawer
      @input="clickDrawerCallback"
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item clickable @click="$router.push('/auth/switch')"
                v-show="isShowSwitch">
          <q-item-section avatar>
            <q-icon name="people"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>切换帐号</q-item-label>
            <q-item-label caption>切换到或者绑定其他帐号</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="bindLineCallback" v-show="isShowBind">
          <q-item-section avatar>
            <q-icon name="fab fa-line"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>绑定 Line</q-item-label>
            <q-item-label caption>将 Line 帐号与本站帐号绑定</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list>
        <q-item clickable @click="signOut">
          <q-item-section avatar>
            <q-icon name="logout"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>登出</q-item-label>
            <q-item-label caption>退出当前登录的所有帐号</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'UserLayout',
  data () {
    return {
      isShowSwitch: false,
      isShowBind: false,
      leftDrawerOpen: false
    }
  },
  mounted: function () {
    const tokenType = this.$q.localStorage.getItem('token_type')
    if (tokenType === 'teacher' || tokenType === 'student') {
      this.$router.push({ path: '/' + tokenType })
    }
  },
  methods: {
    bindLineCallback () {
      this.startBindLineProcess()
    },
    clickDrawerCallback () {
      if (this.isLineTokenInLocal() || this.isLineTokenInServer()) {
        this.isShowSwitch = true
      } else {
        this.isShowBind = true
      }
    },
    signOut () {
      this.signOutAndDeleteData()
    }
  }
}
</script>

<style>
</style>
