import { LocalStorage } from 'quasar'

export default async ({ app, router, Vue }) => {
  router.beforeEach((to, from, next) => {
    const token = LocalStorage.getItem('access_token')
    const tokenType = LocalStorage.getItem('token_type')
    const tokenExpireTS = LocalStorage.getItem('token_expire_at')

    const nowTS = new Date()
    if (token && tokenExpireTS > nowTS) {
      if ((to.path === '/student' && tokenType !== 'student') ||
        (to.path === '/teacher' && tokenType !== 'teacher')
      ) {
        router.push({ path: '/auth/switch' })
      }

      if (to.path === '/auth/switch' && tokenType !== 'line') {
        router.push({ path: '/auth' })
      }
    } else {
      if (to.path !== '/auth') {
        router.push({ path: '/auth' })
      }
    }

    next()
  })
}
