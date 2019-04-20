<template>
  <q-infinite-scroll @load="onLoad" :offset="250" :disable="disableScroll">

    <div v-for="(item, index) in items" :key="index"
         @click="handleOperate(item)">
      <q-item>
        <q-item-section>
          <q-item-label
            class="text-h6 cn-bold-font">
            教师
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced inset/>
    </div>
    <q-item v-if="disableScroll">
      <q-item-label caption
                    style="margin: 5px 0px 5px 0px">fin.
      </q-item-label>
    </q-item>
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="adminSecondary" size="40px"/>
      </div>
    </template>
  </q-infinite-scroll>

</template>

<script>
import axios from 'axios'

export default {
  // name: 'PageName',
  mounted: function () {

  },
  data () {
    return {
      leaveMessageTextValue: '',
      needLoginDialog: false,
      tgLoginDialogStatus: false,
      confirm: false,
      contactCard: false,
      disableScroll: false,
      show: true,
      componentKey: 0,
      page: 1,
      items: [],
      info: '',
      targetItem: [],
      messagePlaceHolder: '',
      requestListPrefix: ''
    }
  },

  methods: {
    fetchData (hideLoading, emptyContent = false) {
      if (emptyContent === true) {
        this.items = []
        this.disableScroll = false
      }

      axios.get('admin/students' + '?page_size=20&page=' + this.page +
          '&keyword=&sort=id|desc')
        .then((response) => {
          const result = response['data']
          const newItems = result['data']
          newItems.forEach(item => {
            this.items.push(item)
          })
          this.page++
          hideLoading()

          if (result['current_page'] >= result['last_page']) {
            this.disableScroll = true
          }
        })
    },
    onLoad (index, done) {
      setTimeout(() => {
        this.fetchData(done)
      }, 100)
    }
  }
}
</script>

<style>
</style>
