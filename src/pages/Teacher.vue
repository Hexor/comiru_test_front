// 教师帐号个人信息页

<template>
  <div class="q-pa-md" style="">
    <q-card bordered class="">
      <q-card-section>
        <div class="text-h6">欢迎教师</div>
        <div class="text-body1">{{teacherInfo}}</div>
      </q-card-section>

      <q-separator inset/>

    </q-card>
    <br>
    <q-page>

      <q-scroll-area :offset="250">

        <div v-for="(item, index) in students" :key="index">

          <q-item>
            <q-item-section>
              <q-item-label
                style="font-size: 15px;"
                class="text-h6 cn-bold-font">
                学员 {{item.student.username}} 已经关注您
              </q-item-label>
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
      teacherInfo: '',
      students: null
    }
  },
  mounted: function () {
    const that = this
    axios.get('teacher').then((response) => {
      that.teacherInfo = response['data']
    }).catch((errorResponse) => {
      this.handleErrorResponse(errorResponse)
    })
      .then(function () {
        that.loading = false
      })

    axios.get('students').then((response) => {
      that.students = response['data']
    }).catch((errorResponse) => {
      this.handleErrorResponse(errorResponse)
    })
      .then(function () {
      })
  },
  methods: {}
}
</script>

<style>
</style>
