<template>
  <div class="q-pa-md" style="max-width: 500px">

    <div class="row items-center">
      <q-btn
        @click="$router.push('/auth/bind_login')"
        class="col" flat color="primary">绑定新帐号
      </q-btn>
    </div>
    <div>

    </div>
    <q-card v-show="!lineUsers" bordered class="">
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
                教师 {{item.student.username}}
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
      items: [1, 23],
      lineUsers: null
    }
  },
  created: function () {
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
    }).catch((errorResponse) => {
      this.handleErrorResponse(errorResponse)
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
