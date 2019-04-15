<template>
  <div class="q-pa-md" style="max-width: 500px">
    <q-card bordered class="">
      <q-card-section>
        <div class="text-h6">注册 Comiru</div>
      </q-card-section>

      <q-separator inset/>

      <q-card-section>
        <form
          @submit.prevent.stop="onSubmit"
          class="q-gutter-md"
        >

          <q-input
            filled
            ref="username"
            v-model="username"
            label="用户名"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '请输入用户名']"
          />

          <q-input
            lazy-rules
            ref="password"
            :rules="[ val => val && val.length > 0 || '请输入密码']"
            label="密码" v-model="password" filled
            :type="isPwd ?'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-input
            filled
            ref="nickname"
            v-model="nickname"
            label="昵称"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-radio v-model="signupType" val="student" label="我是学员"/>
          <q-radio v-model="signupType" val="teacher" label="我是教师"/>

          <div class="row items-center justify-between">
            <q-btn class="col"
                   type="submit"
                   :loading="loading"
                   color="primary"
                   style="width: 150px">
              注册
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left"/>
                注册中...
              </template>
            </q-btn>
          </div>

          <div class="row items-center">
            <q-btn
              @click="$router.push('/auth')"
              class="col" flat color="primary">已有帐号? 前往登录
            </q-btn>
          </div>
        </form>

      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  // name: 'PageName',
  data () {
    return {
      formHasError: false,

      signupType: 'student',
      loading: false,
      nickname: null,
      username: null,

      accept: false,
      isPwd: true,
      password: null,
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    simulateProgress (number) {
      this.loading = true
      setTimeout(() => {
        // we're done, we reset loading state
      }, 3000)
    },
    onSubmit () {
      this.$refs.username.validate()
      this.$refs.nickname.validate()
      this.$refs.password.validate()

      if (
        this.$refs.username.hasError ||
          this.$refs.nickname.hasError ||
          this.$refs.password.hasError
      ) {
        this.formHasError = true
        return
      }

      this.loading = true
      const that = this
      axios.post('auth/signup', {
        username: that.username,
        password: that.password,
        nickname: that.nickname,
        signup_type: that.signupType
      })
        .then((response) => {
          this.$q.notify({
            color: 'info',
            icon: 'thumb_up',
            message: '注册成功 !',
            timeout: 500
          })
          const nowTS = new Date()
          that.$q.localStorage.set('access_token', response.data.access_token)
          that.$q.localStorage.set('token_type', that.signupType)
          that.$q.localStorage.set('token_expire_at', nowTS.getTime() + response.data.expires_in * 1000)
          that.$router.push({ path: '/' })
        })
        .catch((errorResponse) => {
          const errors = errorResponse.response.data.errors
          console.log(errors)
          let errorMessage = ''
          for (var i in errors) {
            errorMessage = errorMessage + errors[i] + ' '
          }
          that.$q.notify({
            multiLine: true,
            color: 'negative',
            message: errorMessage
          })
        })
        .then(function () {
          that.loading = false
        })
    },

    onReset () {
      this.name = null
      this.age = null

      this.$refs.name.resetValidation()
      this.$refs.age.resetValidation()
    }
  }
}
</script>

<style>
</style>
