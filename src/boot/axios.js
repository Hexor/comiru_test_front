import axios from 'axios'
import { LocalStorage } from 'quasar'

export default async ({ Vue }) => {
  const token = LocalStorage.getItem('access_token')
  axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
  Vue.prototype.$axios = axios
}
