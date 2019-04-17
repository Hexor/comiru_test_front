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

          <q-radio v-model="signType" val="student" label="我是学员"/>
          <q-radio v-model="signType" val="teacher" label="我是教师"/>

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
              @click="toLoginBtnCallback()"
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

      signType: 'student',
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
    toLoginBtnCallback () {
      if (this.$route.path === '/auth/bind_register') {
        this.$router.push('/auth/bind_login')
      } else {
        this.$router.push('/auth/login')
      }
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
      if (this.$route.path === '/auth/bind_register') {
        // 如果是在绑定页面注册
        let url = ''
        let postContent = {
          username: this.username,
          password: this.password,
          nickname: this.nickname,
          sign_type: this.signType,
          is_signup: true
        }

        if (this.isLineTokenInServer()) {
          url = this.getLocalTokenType() + '/bind_user'
        } else if (this.isLineTokenInLocal()) {
          url = 'line/bind_user'
          const lineToken = this.$q.localStorage.getItem('line_access_token')
          postContent['line_token'] = lineToken
        }

        axios.post(url, postContent)
          .then((response) => {
            that.$q.notify({
              color: 'info',
              icon: 'thumb_up',
              message: '注册成功 !',
              timeout: 500
            })
            that.$router.push({ path: '/auth/switch' })
          })
          .catch((errorResponse) => {
            let errorMessage = errorResponse.response.data.message
            that.$q.notify({
              multiLine: true,
              color: 'negative',
              message: errorMessage
            })
          })
          .then(function () {
            that.loading = false
          })
      } else {
        // 如果是在非绑定页面注册
        axios.post('auth/signup', {
          username: that.username,
          password: that.password,
          nickname: that.nickname,
          sign_type: that.signType
        })
          .then((response) => {
            const nowTS = new Date()
            that.updateLocalStorageTokenInfo(
              response.data.access_token,
              that.signType,
              nowTS.getTime() + response.data.expires_in * 1000,
              response.data.line_exist_in_server
            )

            this.$q.notify({
              color: 'info',
              icon: 'thumb_up',
              message: '登录成功 !',
              timeout: 500
            })

            that.$router.push({ path: '/' })
          }
          )
          .catch((errorResponse) => {
            let errorMessage = errorResponse.response.data.message
            that.$q.notify({
              multiLine: true,
              color: 'negative',
              message: errorMessage
            })
          })
          .then(function () {
            that.loading = false
          })
      }
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
