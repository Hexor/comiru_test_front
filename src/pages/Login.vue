<template>
  <div class="q-pa-md" style="max-width: 500px">
    <q-card bordered class="">
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
                   class="col"
                   label="使用 Line 登录"/>
          </div>

          <div class="row items-center">
            <q-btn
              @click="$router.push('/auth/register')"
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
      loading: false,
      formHasError: false,
      signupType: 'student',
      isPwd: true,
      password: null,
      username: null
    }
  },
  methods: {
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
          this.$q.notify({
            color: 'info',
            icon: 'thumb_up',
            message: '登录成功 !',
            timeout: 500
          })
          const nowTS = new Date()
          that.$q.localStorage.set('access_token', response.data.access_token)
          that.$q.localStorage.set('token_type', that.signupType)
          that.$q.localStorage.set('token_expire_at', nowTS.getTime() + response.data.expires_in * 1000)
          that.$router.push({ path: '/' })
        })
        .catch((errorResponse) => {
          let errorMessage = errorResponse.response.data.message
          if (errorResponse.response.status >= 400 &&
            errorResponse.response.status < 500) {
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
