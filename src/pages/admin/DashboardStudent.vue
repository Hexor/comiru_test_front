// 管理学员帐号数据

<template>
  <div class="q-pa-md">
    <q-table
      title="学员管理"
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
            <q-popup-edit v-model="props.row.username"
                          @show="setEditingRow(props.row)"
                          @save="updateUsername"
                          class="cn-bold-font"
                          :title="'修改用户名 (ID:' + props.row.id + ')'"
                          buttons
                          color="adminTitle"
                          label-set="保存"
                          label-cancel="取消"
            >
              <q-input
                color="adminSecondary"
                v-model="props.row.username"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn color="adminTitle"
                   dense
                   icon="delete_outline"
                   @click="deleteUserBtnCallback(props.row)"
            />
          </q-td>
        </q-tr>
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
  </div>

</template>

<script>
import axios from 'axios'
import { QSpinnerDots } from 'quasar'

export default {
  data () {
    return {
      deletingRow: null,
      filter: '',
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
          label: '用户名(点击直接编辑)',
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
      axios.delete('admin/students/' + row.id)
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
    setEditingRow (row) {
      this.editingRow = row
    },
    updateUsername (value, initValue) {
      console.log('update' + value)
      this.$q.loading.show({
        spinner: QSpinnerDots,
        spinnerSize: 40,
        spinnerColor: 'adminSecondary',
        backgroundColor: 'white'
      })
      const content = {
        'username': value
      }
      const that = this
      axios.patch('admin/students/' + this.editingRow.id, content)
        .then((response) => {
          this.$q.notify({
            color: 'adminPrimary',
            icon: 'thumb_up',
            message: '修改成功 !',
            timeout: 500
          })
        })
        .catch((errorResponse) => {
          this.editingRow.username = initValue
          this.handleErrorResponse(errorResponse)
        })
        .then(function () {
          that.$q.loading.hide({ delay: 500 })
          this.editingRow = null
        })
    },
    onRequest (props) {
      console.log('onrequest')
      let { page, rowsPerPage, sortBy, descending } = props.pagination
      let filter = props.filter

      this.fetchFromServer(page, rowsPerPage, filter, sortBy, descending)
    },

    fetchFromServer (page, rowsPerPage, filter, sortBy, descending) {
      let sortMode = 'asc'
      if (descending) {
        sortMode = 'desc'
      }
      this.loading = true
      axios.get('admin/students' + '?page_size=' + rowsPerPage + '&page=' +
          page +
          '&keyword=' + filter + '&sort=' + sortBy + '|' + sortMode)
        .then((response) => {
          const returnedData = response['data']['data']

          this.data.splice(0, this.data.length, ...returnedData)

          this.pagination.page = page
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending
          this.pagination.rowsNumber = response['data']['total']
        }
        ).catch((response) => {
          this.handleErrorResponse(response)
        }).then(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
</style>
