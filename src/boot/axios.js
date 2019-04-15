import axios from 'axios'

export default async ({ Vue }) => {
  axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'
  Vue.prototype.$axios = axios
}
