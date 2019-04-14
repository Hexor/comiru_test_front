export default async ({ app, router, Vue }) => {
  router.beforeEach((to, from, next) => {
    console.log('before')
    if (to.path !== '/auth') {
      router.push({ path: '/auth' })
    }
    next()
  })
}
