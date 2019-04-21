import { LocalStorage } from 'quasar'

export default async ({ app, router, Vue }) => {
  router.beforeEach((to, from, next) => {
    console.log('route to ' + to.path)
    const token = LocalStorage.getItem('access_token')
    const tokenType = LocalStorage.getItem('token_type')
    const tokenExpireTS = LocalStorage.getItem('token_expire_at')

    const nowTS = new Date()

    if (token && tokenExpireTS > nowTS) {
      switch (to.path) {
        case '/student':
          break
        case '/teacher':
          break
        case '/':
        case '/auth':
        case '/auth/register':
        case '/auth/login':
          router.push({ path: '/' + tokenType })
          return
        case '/auth/bind_login':
        case '/auth/bind_register':
          break
        case '/auth/switch':
          break
        case '/auth/line':
          // 接受来自服务器的 line 登录成功数据
          break
        case '/admin/dashboard':
          router.push({ path: '/admin/dashboard/student' })
          return
        default:
          break
      }
    } else if (
      Vue.prototype.isLineTokenInLocal() ||
        Vue.prototype.isLineTokenInServer()
    ) {
      switch (to.path) {
        case '/student':
          break
        case '/teacher':
          break
        case '/':
        case '/auth':
        case '/auth/login':
        case '/auth/register':
          router.push({ path: '/auth/switch' })
          return
        case '/auth/bind_login':
        case '/auth/bind_register':
          break
        case '/auth/switch':
          break
        case '/auth/line':
          // 接受来自服务器的 line 登录成功数据
          break
        case '/admin/dashboard':
          router.push({ path: '/admin/dashboard/student' })
          return
        default:
          break
      }
    } else {
      switch (to.path) {
        case '/student':
        case '/teacher':
        case '/auth/bind_login':
        case '/auth/bind_register':
        case '/auth/switch':
        case '/auth':
        case '/':
          router.push({ path: '/auth/login' })
          return
        case '/auth/line':
          // 接受来自服务器的 line 登录成功数据
          break
        case '/auth/register':
        case '/auth/login':
          break
        case '/admin/dashboard':
          router.push({ path: '/admin/dashboard/student' })
          return
        default:
          break
      }
    }

    next()
  })
}
