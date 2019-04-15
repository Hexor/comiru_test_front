import { LocalStorage } from 'quasar'

export default async ({ app, router, Vue }) => {
  router.beforeEach((to, from, next) => {
    const token = LocalStorage.getItem('access_token')
    const tokenType = LocalStorage.getItem('token_type')
    const tokenExpireTS = LocalStorage.getItem('token_expire_at')

    const nowTS = new Date()
    if (token && tokenExpireTS > nowTS) {
      // 本地存在已经登录的用户身份
      if ((to.path === '/student' && tokenType !== 'student') ||
        (to.path === '/teacher' && tokenType !== 'teacher')
      ) {
        router.push({ path: '/auth/switch' })
      }

      if (to.path === '/auth/switch' && tokenType !== 'line') {
        router.push({ path: '/auth' })
      }
    } else if (to.path === '/auth/line') {
      // 绑定line帐号
      console.log(to.path)
    } else {
      // 本地不存在任何用户身份信息
      if (to.path !== '/auth') {
        router.push({ path: '/auth' })
      }
    }

    next()
  })
}
