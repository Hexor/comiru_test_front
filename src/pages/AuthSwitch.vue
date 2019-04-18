// 切换用户页面

<template>
  <div class="q-pa-md full-width " style="">

    <div class="row items-center">
      <q-btn
        @click="$router.push('/auth/bind_login')"
        class="col" flat color="primary">点击绑定新帐号
      </q-btn>
    </div>
    <div>

    </div>
    <q-card v-show="noBindCard" bordered class="">
      <q-card-section>
        <div class="text-body2">当前 Line 尚未绑定任何帐号</div>
      </q-card-section>

      <q-separator inset/>

    </q-card>
    <q-page>

      <q-scroll-area :offset="250">

        <div v-for="(item, index) in lineUsers" :key="index"
             @click="switchUser(item)">

          <q-item>
            <q-item-section>
              <q-item-label
                v-if="item.teacher"
                style="font-size: 15px;"
                class="text-h6 cn-bold-font">
                教师 {{item.teacher.username}}
              </q-item-label>
              <q-item-label
                v-if="item.student"
                style="font-size: 15px;"
                class="text-h6 cn-bold-font">
                学员 {{item.student.username}}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="swap_horiz" color="primary"/>
            </q-item-section>
          </q-item>
          <q-separator spaced inset/>
        </div>
      </q-scroll-area>

    </q-page>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      lineUsers: null,
      noBindCard: false
    }
  },
  mounted: function () {
    this.refreshData()
  },
  created: function () {
  },
  methods: {
    refreshData () {
      const that = this

      const localTokenType = this.getLocalTokenType()
      if (!localTokenType) {
        return
      }

      const lineToken = this.$q.localStorage.getItem('line_access_token')
      let url = localTokenType + '/line_users'
      if (localTokenType === 'line') {
        url = url + '?line_token=' + lineToken
      }
      axios.get(url).then((response) => {
        that.lineUsers = response['data']
        if (that.lineUsers.length === 0) {
          this.noBindCard = true
        }
      }).catch((errorResponse) => {
        this.handleErrorResponse(errorResponse)
      })
        .then(function () {
          that.loading = false
        })
    },
    switchUser (item) {
      console.log(item)
      let postContent = {}
      if (item.student) {
        postContent['sign_type'] = 'student'
        postContent['id'] = item.student.id
      } else if (item.teacher) {
        postContent['sign_type'] = 'teacher'
        postContent['id'] = item.teacher.id
      }
      const localTokenType = this.getLocalTokenType()
      if (!localTokenType) {
        return
      }

      const lineToken = this.$q.localStorage.getItem('line_access_token')
      let url = localTokenType + '/switch_user'
      if (localTokenType === 'line') {
        postContent['line_token'] = lineToken
      }
      const that = this
      axios.post(url, postContent)
        .then((response) => {
          const nowTS = new Date()
          that.updateLocalStorageTokenInfo(
            response.data.access_token,
            response.data.sign_type,
            nowTS.getTime() + response.data.expires_in * 1000
          )

          this.$q.notify({
            color: 'info',
            icon: 'thumb_up',
            message: '登录成功 !',
            timeout: 500
          })

          that.$router.push({ path: '/' + response.data.sign_type })
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
  }
}
</script>

<style>
</style>
