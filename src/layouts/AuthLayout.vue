<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>

        <q-btn
          flat
          v-show="showBackBtn"
          @click="$router.go(-1)"
          icon="arrow_back"
        />
        <q-toolbar-title class="text-center" style="font-weight: bolder;">
          Comiru
        </q-toolbar-title>
        <q-btn
          flat
          v-show="showBackBtn"
          @click="$router.go(-1)"
          icon="arrow_back"
          style="visibility: hidden"
        />

        <!--<q-avatar >-->
        <!--<q-img style="width:28px; height: 28px"-->
        <!--src="/assets/logo.png"></q-img>-->
        <!--</q-avatar>-->
        <!--<div>Quasar v{{ $q.version }}</div>-->
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>

    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'AuthLayout',
  data () {
    return {
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

    onSubmit () {
      this.$refs.name.validate()
      this.$refs.age.validate()

      if (this.$refs.name.hasError || this.$refs.age.hasError) {
        this.formHasError = true
      } else if (this.accept !== true) {
        this.$q.notify({
          color: 'negative',
          message: 'You need to accept the license and terms first'
        })
      } else {
        this.$q.notify({
          icon: 'done',
          color: 'positive',
          message: 'Submitted'
        })
      }
    },

    onReset () {
      this.name = null
      this.age = null

      this.$refs.name.resetValidation()
      this.$refs.age.resetValidation()
    },
    openURL
  }
}
</script>

<style>
</style>
