<template>
  <div class="q-pa-md">
    <q-table
      title="教师管理"
      class="cn-bold-font"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      rows-per-page-label="每页显示数量"
      no-results-label="没有任何数据"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="username" :props="props">
            {{ props.row.username }}
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn color="adminTitle"
                   dense
                   @click="deleteUserBtnCallback(props.row)"
                   icon="delete_outline"/>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-left>
        <!--<q-item>-->
        <!--<q-item-section >-->
        <q-btn dense color="adminSecondary text-black" :disable="loading"
               label="添加教师"
               @click="addTeacher"/>
        <!--</q-item-section>-->
        <!---->
        <!--<q-item-section >-->
        <!--</q-item-section>-->
        <!--<q-item-section side>-->
        <!--</q-item-section>-->
        <!--</q-item>-->
      </template>

      <template v-slot:top-right>
        <!--<q-item>-->
        <!--<q-item-section >-->
        <!--<q-btn dense color="adminSecondary text-black" :disable="loading"-->
        <!--icon="plus_circle_outline"-->
        <!--@click="addRow"/>-->
        <!--</q-item-section>-->
        <!---->
        <!--<q-item-section >-->
        <!--</q-item-section>-->
        <!--<q-item-section side>-->
        <q-input dense debounce="300" v-model="filter"
                 color="adminSecondary"
                 placeholder="搜索用户名, id">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <!--</q-item-section>-->
        <!--</q-item>-->
      </template>

    </q-table>
    <q-dialog
      v-model="needConfirmDeleteDialog"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <!--<div class="text-h6">已加密</div>-->
        </q-card-section>

        <q-card-section>
          确认删除该用户吗? 这同时也将删除该用户的 Line 绑定与教师关注数据.
        </q-card-section>
        <q-card-section caption>
          <q-item-label caption
                        style="font-size: 14px">
            {{deletingRow}}
          </q-item-label>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-adminPrimary">
          <q-btn color="" flat label="关闭" v-close-dialog/>
          <q-btn class="text-white bg-adminTitle" label="确认删除"
                 v-close-dialog
                 v-on:click="sureToDeleteUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createTeacherDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">创建新教师帐号</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newTeacherModel.username"
                   color="adminSecondary"
                   placeholder='用户名'
                   :rules="[ val => val.length <= 10 ||
'用户名最长 10 位']"
                   autofocus/>
          <q-input v-model="newTeacherModel.password"
                   color="adminSecondary"
                   :rules="[ val => (val.length >= 6 && val.length < 20)||
                   '密码长度最少6位, 最长20位']"
                   placeholder='密码'
          />
          <q-input v-model="newTeacherModel.nickname"
                   color="adminSecondary"
                   placeholder='昵称'
          />
        </q-card-section>

        <q-card-actions align="right" class="text-adminTitle">
          <q-btn flat label="取消" v-close-popup/>
          <q-btn flat label="创建" v-close-popup @click="createTeacher"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script>
import axios from 'axios'
import { QSpinnerDots } from 'quasar'

export default {
  // name: 'PageName',
  data () {
    return {
      selected: [],
      newTeacherModel: {
        username: null,
        password: null,
        nickname: null
      },
      errorUsername: false,
      errorMessageUsername: '',
      search: '',
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
      createTeacherDialog: false,
      targetItem: [],
      messagePlaceHolder: '',
      requestListPrefix: '',
      filter: '',
      deletingRow: null,
      needConfirmDeleteDialog: false,
      loading: false,
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'username',
          required: true,
          label: '用户名',
          align: 'left',
          field: row => row.username,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'delete',
          required: true,
          label: '操作',
          align: 'center'
          // field: row => row.username,
          // format: val => `${val}`,
          // sortable: true
        }
        // {
        //   name: 'nickname',
        //   align: 'left',
        //   label: '昵称',
        //   field: row => row.nickname,
        //   sortable: false
        // },
        // {
        //   name: 'created_at',
        //   align: 'left',
        //   label: '创建时间',
        //   field: row => row.created_at,
        //   sortable: true
        // }
        // { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        // { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        // { name: 'carbs', label: 'Carbs (g)', field: 'carbs', sortable: true },
        // {
        //   name: 'calcium',
        //   label: 'Calcium (%)',
        //   field: 'calcium',
        //   sortable: true,
        //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        // },
        // {
        //   name: 'iron',
        //   label: 'Iron (%)',
        //   field: 'iron',
        //   sortable: true,
        //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        // }
      ],
      data: [],
      editingRow: null
    }
  },
  mounted () {
    // get initial data from server (1st page)
    var iHeight = window.screen.height
    console.log(iHeight)
    this.pagination.rowsPerPage = Math.round((iHeight - 390) / 40) - 1
    if (this.pagination.rowsPerPage < 1) {
      this.pagination.rowsPerPage = 1
    }
    this.onRequest({
      pagination: this.pagination,
      filter: ''
    })
  },
  methods: {
    removeUserFromDisplay (id) {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i]['id'] === id) {
          this.data.splice(i, 1)
        }
      }
    },
    deleteUserBtnCallback (row) {
      this.deletingRow = row
      this.needConfirmDeleteDialog = true
    },
    sureToDeleteUser () {
      const row = this.deletingRow
      this.$q.loading.show({
        spinner: QSpinnerDots,
        spinnerSize: 40,
        spinnerColor: 'adminSecondary',
        backgroundColor: 'white'
      })
      const that = this
      axios.delete('admin/teachers/' + row.id)
        .then((response) => {
          that.removeUserFromDisplay(row.id)
          this.$q.notify({
            color: 'adminPrimary',
            icon: 'delete_outline',
            message: '删除成功 !',
            timeout: 500
          })
        })
        .catch((errorResponse) => {
          let errorMessage = errorResponse.response.data.message
          that.$q.notify({
            multiLine: true,
            color: 'negative',
            message: errorMessage
          })
        })
        .finally(function () {
          that.$q.loading.hide({ delay: 500 })
          that.deletingRow = null
        })
    },
    createTeacher () {
      this.$q.loading.show({
        spinner: QSpinnerDots,
        spinnerSize: 40,
        spinnerColor: 'adminSecondary',
        backgroundColor: 'white'
      })
      const that = this
      axios.post('admin/teachers', this.newTeacherModel)
        .then((response) => {
          this.fetchFromServer(1, that.pagination.rowsPerPage, '', 'id', true)
        }
        ).catch((errorResponse) => {
          let errorMessage = errorResponse.response.data.message
          that.$q.notify({
            multiLine: true,
            color: 'negative',
            message: errorMessage
          })
        }).finally(() => {
          that.$q.loading.hide({ delay: 500 })
          this.newTeacherModel = {
            username: null,
            password: null,
            nickname: null
          }
        })
    },
    addTeacher () {
      this.createTeacherDialog = true
    },
    setEditingRow (row) {
      this.editingRow = row
      console.log(row)
    },
    updateUsername (value, initValue) {
      console.log('update' + value)
      this.$q.loading.show({
        spinner: QSpinnerDots,
        spinnerSize: 40,
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      setTimeout(() => {
        this.editingRow.username = 'abcd'
        this.loading = false
        this.$q.loading.hide({ delay: 500 })
      }, 1000)
    },
    onRequest (props) {
      console.log('onrequest')
      let { page, rowsPerPage, sortBy, descending } = props.pagination
      let filter = props.filter

      // update rowsCount with appropriate value

      // fetch data from "server"
      this.fetchFromServer(page, rowsPerPage, filter, sortBy, descending)

      // ...and turn of loading indicator
    },

    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    fetchFromServer (page, rowsPerPage, filter, sortBy, descending) {
      console.log(filter)
      this.loading = true
      let sortMode = 'asc'
      if (descending) {
        sortMode = 'desc'
      }

      axios.get('admin/teachers' + '?page_size=' + rowsPerPage + '&page=' +
          page + '&keyword=' + filter + '&sort=' + sortBy + '|' + sortMode)
        .then((response) => {
          const returnedData = response['data']['data']

          this.data.splice(0, this.data.length, ...returnedData)

          // don't forget to update local pagination object
          this.pagination.page = page
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending
          this.pagination.rowsNumber = response['data']['total']
        }
        ).finally(() => {
          this.loading = false
        })
    },
    getRowsNumberCount (filter) {
      if (!filter) {
        return this.original.length
      }
      let count = 0
      this.original.forEach((treat) => {
        if (treat['name'].includes(filter)) {
          ++count
        }
      })
      return count
    },
    fetchData (hideLoading, emptyContent = false) {
      if (emptyContent === true) {
        this.items = []
        this.disableScroll = false
      }
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
