<template>
  <div class="q-pa-md" style="max-width: 500px">
    <q-card bordered class="">
      <q-card-section>
        <div class="text-h6">欢迎教师</div>
        <div class="text-body1">{{teacherInfo}}</div>
      </q-card-section>

      <q-separator inset/>

    </q-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      teacherInfo: null
    }
  },
  created: function () {
    const that = this
    axios.get('teacher').then((response) => {
      that.teacherInfo = response['data']['data']
    }).catch((errorResponse) => {
      let errorMessage = errorResponse.response.data.message
      if (errorResponse.response.status >= 400 &&
          errorResponse.response.status < 500) {
        errorMessage = '用户身份已经过期, 请重新登录'
      }
      that.$q.notify({
        multiLine: true,
        color: 'negative',
        message: errorMessage
      })
      that.$router.push({ path: '/auth' })
    })
      .then(function () {
        that.loading = false
      })
  },
  methods: {}
}
</script>

<style>
</style>
