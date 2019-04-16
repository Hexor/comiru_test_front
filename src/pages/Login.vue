<template>
  <div class="q-pa-md full-width absolute-center" style="max-width:500px">
    <q-card bordered>
      <q-card-section>
        <div class="text-h6">登录 Comiru</div>
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

          <q-radio v-model="signupType" val="student" label="我是学员"/>
          <q-radio v-model="signupType" val="teacher" label="我是教师"/>

          <div class="row items-center justify-between">
            <q-btn class="col"
                   type="submit"
                   :loading="loading"
                   color="primary"
                   style="width: 150px">
              登录
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left"/>
                登录中...
              </template>
            </q-btn>
          </div>
          <div class="row items-center">
            <q-btn style="width: 170px; background-color: #00C300; color:white"
                   icon="fab fa-line"
                   v-show="!this.isLineTokenInLocal()"
                   class="col"
                   @click="lineBtnCallback"
                   :label="lineBtnText"/>
          </div>

          <div class="row items-center">
            <q-btn
              @click="registerBtnCallback"
              class="col" flat color="primary">没有帐号? 现在注册
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
      lineBtnText: '使用 Line 登录',
      loading: false,
      formHasError: false,
      signupType: 'student',
      isPwd: true,
      password: null,
      username: null
    }
  },
  mounted: function () {
    if (this.isLineTokenInLocal()) {
    }
  },
  methods: {
    registerBtnCallback () {
      if (this.isLineTokenInLocal()) {
        this.$router.push('/auth/bind_register')
      } else {
        this.$router.push('/auth/register')
      }
    },
    lineBtnCallback () {
      this.startLoginAsLineProcess()
    },
    onSubmit () {
      this.$refs.username.validate()
      this.$refs.password.validate()
      if (
        this.$refs.username.hasError ||
          this.$refs.password.hasError
      ) {
        this.formHasError = true
        return
      }

      this.loading = true
      const that = this
      axios.post('auth/signin', {
        username: that.username,
        password: that.password,
        signup_type: that.signupType
      })
        .then((response) => {
          const nowTS = new Date()
          that.$q.localStorage.set('line_exist_in_server',
            response.data.line_exist_in_server)
          that.updateLocalStorageTokenInfo(
            response.data.access_token,
            that.signupType,
            nowTS.getTime() + response.data.expires_in * 1000
          )

          if (that.isLineTokenInLocal()) {
            that.bindSignInTokenWithLineToken()
          } else {
            this.$q.notify({
              color: 'info',
              icon: 'thumb_up',
              message: '登录成功 !',
              timeout: 500
            })

            if (that.$route.path === '/auth/bind_login') {
              that.$router.push({ path: '/auth/switch' })
            } else {
              that.$router.push({ path: '/' })
            }
          }
        })
        .catch((errorResponse) => {
          let errorMessage = errorResponse.message
          if (errorResponse.status >= 400 &&
              errorResponse.status < 500) {
            errorMessage = '登录验证失败, 用户不存在或者密码错误'
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
