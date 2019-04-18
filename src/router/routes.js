const routes = [
  {
    path: '/',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      { path: 'student', component: () => import('pages/Student.vue') },
      { path: 'teacher', component: () => import('pages/Teacher.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'register', component: () => import('pages/Register.vue') },
      { path: 'bind_login', component: () => import('pages/Login.vue') },
      { path: 'bind_register', component: () => import('pages/Register.vue') },
      { path: 'switch', component: () => import('pages/AuthSwitch.vue') },
      { path: 'line',
        component: () => import('pages/BindLine.vue'),
        props: (route) => ({
          access_token: route.query.access_token,
          expires_in: route.query.expires_in
        })
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}
export default routes
