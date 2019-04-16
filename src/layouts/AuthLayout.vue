<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>

        <q-avatar >
          <q-img style="width:28px; height: 28px"
                 src="/assets/logo.png"></q-img>
        </q-avatar>

        <q-toolbar-title class="text-center" style="font-weight: bolder;">
          Comiru
        </q-toolbar-title>

        <q-avatar style="visibility: hidden">
          <q-img style="max-width: 25px" contain
                 src="/assets/favicon.ico"></q-img>
        </q-avatar>
        <!--<div>Quasar v{{ $q.version }}</div>-->
      </q-toolbar>
    </q-header>

    <q-page-container >
      <router-view />

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

      accept: false,
      isPwd: true,
      password: null,
      leftDrawerOpen: this.$q.platform.is.desktop
    }
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
