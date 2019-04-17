<template>

  <q-page>
  <div class="q-pa-md full-width " style="">
    <q-card bordered class="">
      <q-card-section>
        <div class="text-h6">欢迎学员</div>
        <div class="text-body1">{{studentInfo}}</div>
      </q-card-section>

      <q-separator inset/>

    </q-card>
    <br>
    <div class="text-center text-h6">以下是所有的老师, 点击后即可关注</div>

      <q-scroll-area :offset="250">

        <div v-for="(item, index) in teachers" :key="index"
             @click="followTeacher(item)">

          <q-item>
            <q-item-section>
              <q-item-label
                style="font-size: 15px;"
                class="text-h6 cn-bold-font">
                教师 {{item.nickname}}
              </q-item-label>
              <q-item-label
                class="text-primary"
              >
                {{item.follow_status}}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced inset/>
        </div>
      </q-scroll-area>

  </div>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      studentInfo: '',
      teachers: null,
      followedTeachers: []
    }
  },
  mounted: function () {
    const that = this
    axios.get('student').then((response) => {
      that.studentInfo = response['data']
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
      })

    axios.get('teachers').then((response) => {
      that.teachers = response['data']
      for (var key in this.teachers) {
        const teacher = this.teachers[key]
        if (teacher.followed.length) {
          teacher.follow_status = '已关注'
        } else {
          teacher.follow_status = ''
        }
      }
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
      })
  },
  methods: {
    followTeacher (item, index) {
      const that = this

      axios.post('student/follow_teacher', { teacher_id: item.id })
        .then((response) => {
          let message = '关注成功 !'
          item.follow_status = '已关注'
          that.teachers.sort()
          if (response.data.follows_status === 'unfollowing') {
            item.follow_status = ''
            message = '取消关注成功 !'
          }
          that.$q.notify({
            color: 'info',
            icon: 'thumb_up',
            message: message,
            timeout: 500
          })
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
        })
    }
  }
}
</script>

<style>
</style>
