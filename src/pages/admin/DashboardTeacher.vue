// 管理教师帐号数据

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
        <q-btn dense color="adminSecondary text-black" :disable="loading"
               label="添加教师"
               @click="addTeacher"/>
      </template>

      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter"
                 color="adminSecondary"
                 placeholder="搜索用户名, id">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>

    </q-table>
    <q-dialog
      v-model="needConfirmDeleteDialog"
    >
      <q-card style="width: 700px; max-width: 80vw;">

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
  data () {
    return {
      newTeacherModel: {
        username: null,
        password: null,
        nickname: null
      },
      createTeacherDialog: false,
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
        }
      ],
      data: [],
      editingRow: null
    }
  },
  mounted () {
    var iHeight = window.screen.height
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
          this.handleErrorResponse(errorResponse)
        })
        .then(function () {
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
          this.handleErrorResponse(errorResponse)
        }).then(() => {
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
    onRequest (props) {
      let { page, rowsPerPage, sortBy, descending } = props.pagination
      let filter = props.filter
      this.fetchFromServer(page, rowsPerPage, filter, sortBy, descending)
    },

    fetchFromServer (page, rowsPerPage, filter, sortBy, descending) {
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

          this.pagination.page = page
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending
          this.pagination.rowsNumber = response['data']['total']
        }
        ).then(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
</style>
