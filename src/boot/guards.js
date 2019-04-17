import { LocalStorage } from 'quasar'

export default async ({ app, router, Vue }) => {
  router.beforeEach((to, from, next) => {
    console.log('route to ' + to.path)
    const token = LocalStorage.getItem('access_token')
    const tokenType = LocalStorage.getItem('token_type')
    const tokenExpireTS = LocalStorage.getItem('token_expire_at')

    const nowTS = new Date()
    if (token && tokenExpireTS > nowTS) {
      // 本地存在已经登录的用户身份
      if (to.path === '/auth') {
        router.push({ path: '/' + tokenType })
        return
      }

      if ((to.path === '/student' && tokenType !== 'student') ||
        (to.path === '/teacher' && tokenType !== 'teacher')
      ) {
        router.push({ path: '/auth/switch' })
        return
      }
    } else if (to.path === '/auth/line') {
      // 接受来自服务器的 line 登录成功数据
    } else if (
      to.path === '/auth/bind_login' ||
      to.path === '/auth/bind_register'
    ) {
      if (!Vue.prototype.isLineTokenInLocal()) {
        router.push({ path: '/auth/switch' })
        return
      }
    } else if (Vue.prototype.isLineTokenInLocal()) {
      // 本地存在已经登录的line身份

    } else {
      // 本地不存在任何用户身份信息
      if (to.path === '/auth' || to.path === '/auth/register') {
        // router.push({ path: '/auth' })
        // console.log('wrong1')
        // return
        console.log('fine')
      } else {
        router.push({ path: '/auth' })
      }
    }

    next()
  })
}
