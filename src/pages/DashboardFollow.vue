<template>
  <div class="q-pa-md">
    <q-table
      title="关注管理"
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
          <q-td key="teacher_username" :props="props">
            {{ props.row.teacher.username}}
          </q-td>
          <q-td key="student_username" :props="props">
            {{ props.row.student.username}}
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn color="adminTitle"
                   dense
                   @click="deleteBtnCallback(props.row)"
                   icon="delete_outline"/>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter"
                 color="adminSecondary"
                 placeholder="搜索用户名">
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
          确认断开该关注关系吗?
        </q-card-section>
        <q-card-section caption>
          <q-item-label caption
                        style="font-size: 14px">
            {{deletingRow.student.username}} 于 {{deletingRow.created_at}} 关注了
            {{deletingRow.teacher.username}}
          </q-item-label>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-adminPrimary">
          <q-btn color="" flat label="关闭" v-close-dialog/>
          <q-btn class="text-white bg-adminTitle" label="确认删除"
                 v-close-dialog
                 v-on:click="sureToDelete"
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
  // name: 'PageName',
  data () {
    return {
      deletingRow: {
        student: '',
        teacher: ''
      },
      search: '',
      leaveMessageTextValue: '',
      needConfirmDeleteDialog: false,
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
      requestListPrefix: '',
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'updated_at',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {
          name: 'teacher_username',
          required: true,
          label: '教师用户名',
          align: 'left',
          sortable: true
        },
        {
          name: 'student_username',
          required: true,
          label: '学员用户名',
          align: 'left',
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
    removeFromDisplay (id) {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i]['id'] === id) {
          this.data.splice(i, 1)
        }
      }
    },
    deleteBtnCallback (row) {
      this.deletingRow = row
      this.needConfirmDeleteDialog = true
    },
    sureToDelete () {
      const row = this.deletingRow
      this.$q.loading.show({
        spinner: QSpinnerDots,
        spinnerSize: 40,
        spinnerColor: 'adminSecondary',
        backgroundColor: 'white'
      })
      const that = this
      axios.delete('admin/teacher_students/' + row.id)
        .then((response) => {
          that.removeFromDisplay(row.id)
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
          that.deletingRow = {
            student: '',
            teacher: ''
          }
        })
    },
    onRequest (props) {
      console.log('onrequest')
      let { page, rowsPerPage, sortBy, descending } = props.pagination
      let filter = props.filter
      this.fetchFromServer(page, rowsPerPage, filter, sortBy, descending)
    },

    fetchFromServer (page, rowsPerPage, filter, sortBy, descending) {
      this.loading = true
      let sortMode = 'asc'
      let sort = ''
      if (descending) {
        sortMode = 'desc'
      }
      if (sortBy === 'teacher_username') {
        sort = 'teacher_id'
      }
      if (sortBy === 'student_username') {
        sort = 'student_id'
      }
      axios.get('admin/teacher_students' + '?page_size=' + rowsPerPage + '&page=' +
          page +
          '&keyword=' + filter + '&sort=' + sort + '|' + sortMode)
        .then((response) => {
          const returnedData = response['data']['data']

          this.data.splice(0, this.data.length, ...returnedData)

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
    }
  }
}
</script>

<style>
</style>
