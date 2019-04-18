import { LocalStorage } from 'quasar'

export default async ({ app, router, Vue }) => {
  router.beforeEach((to, from, next) => {
    console.log('route to ' + to.path)
    const token = LocalStorage.getItem('access_token')
    const tokenType = LocalStorage.getItem('token_type')
    const tokenExpireTS = LocalStorage.getItem('token_expire_at')

    const nowTS = new Date()

    // TODO 解决2个问题 1. guards 的问题 2. 后退按键的问题
    switch (to.path) {
      case '/student':
        break
      case '/teacher':
        break
      case '/':
      case '/auth':
        if (token && tokenExpireTS > nowTS) {
          router.push({ path: '/' + tokenType })
        } else if (Vue.prototype.isLineTokenInLocal()) {
          router.push({ path: '/auth/switch' })
        } else {
          router.push({ path: '/auth/login' })
        }
        return
      case '/auth/register':
        break
      case '/auth/bind_login':
      case '/auth/bind_register':
        break
      case '/auth/switch':
        break
      case '/auth/line':
        // 接受来自服务器的 line 登录成功数据
        break
      default:
    }
    next()
  })
}
