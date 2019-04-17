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

          <q-radio v-model="signType" val="student" label="我是学员"/>
          <q-radio v-model="signType" val="teacher" label="我是教师"/>

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
                   v-show="isShowLineBtn()"
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
      signType: 'student',
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
    isShowLineBtn () {
      if (
        this.$route.path === '/auth/bind_login' ||
          this.isLineTokenInLocal() ||
          this.isLineTokenInServer()
      ) {
        return false
      }
      return true
    },
    registerBtnCallback () {
      if (this.$route.path === '/auth/bind_login') {
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
      if (this.$route.path === '/auth/bind_login') {
        // 如果是在绑定页面登录
        let url = ''
        let postContent = {
          username: this.username,
          password: this.password,
          sign_type: this.signType
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
              message: '登录成功 !',
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
        // 如果是在非绑定页面登录
        axios.post('auth/signin', {
          username: that.username,
          password: that.password,
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
