// 管理员登录页

<template>
  <div class="q-pa-md full-width absolute-center" style="max-width:500px">
    <q-card bordered>
      <q-card-section>
        <div class="text-h6 text-adminTitle">登录 Comiru 后台</div>
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
            color="adminTitle"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '请输入用户名']"
          />

          <q-input
            lazy-rules
            ref="password"
            color="adminTitle"
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

          <div class="row items-center justify-between">
            <q-btn class="col"
                   type="submit"
                   :loading="loading"
                   color="adminSecondary"
                   style="width: 150px">
              登录
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left"/>
                登录中...
              </template>
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
      signType: 'student',
      isPwd: true,
      password: null,
      username: null
    }
  },
  mounted: function () {
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

      axios.post('admin/signin', {
        username: that.username,
        password: that.password
      })
        .then((response) => {
          const nowTS = new Date()
          that.updateLocalStorageAdminTokenInfo(
            response.data.access_token,
            nowTS.getTime() + response.data.expires_in * 1000
          )

          this.$q.notify({
            color: 'info',
            icon: 'thumb_up',
            message: '登录成功 !',
            timeout: 500
          })

          that.$router.push({ path: '/admin/dashboard' })
        }
        )
        .catch((errorResponse) => {
          this.handleErrorResponse(errorResponse)
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
