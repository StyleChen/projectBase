import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

Vue.use(Router)

const routers = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: (resolve) => require(['../pages/login.vue'], resolve)
    },
    {
      path: '/',
      name: 'Home',
      component: (resolve) => require(['../pages/home.vue'], resolve),
      children: [
        {
          path: 'systemMana',
          name: 'SystemMana',
          component: (resolve) => require(['../pages/system/systemMana.vue'], resolve),
          children: [
            {
              path: 'sMUserMana',
              name: 'SMUserMana',
              meta: { title: '用户管理', keepAlive: true },
              component: (resolve) => require(['../pages/system/sMUserMana.vue'], resolve)
            },
            {
              path: 'sMRoleMana',
              name: 'SMRoleMana',
              meta: { title: '角色管理', keepAlive: true },
              component: (resolve) => require(['../pages/system/sMRoleMana.vue'], resolve)
            },
            {
              path: 'sMAuthoMana',
              name: 'SMAuthoMana',
              meta: { title: '权限管理', keepAlive: true },
              component: (resolve) => require(['../pages/system/sMAuthoMana.vue'], resolve)
            }
          ]
        },
        {
          path: 'demo',
          name: 'Demo',
          meta: { title: 'demo', keepAlive: true },
          component: (resolve) => require(['../pages/demo.vue'], resolve)
        }
      ]
    }
  ]
})

// 判断是否有
routers.beforeEach((to, from, next) => {
  if (to.name !== 'Login') {
    let authority = []
    try {
      authority = store.state.authority.map(item => item.url)
    } catch (e) {}
    if (!store.state.USERID && from.name !== 'Login') {
      next({path: '/login'})
    } else if (!authority.includes(`/${to.fullPath.split('/')[1]}`) && to.name !== 'WorkTable') {
      next({path: '/workTable'})
    } else {
      next()
    }
  } else {
    next()
  }
})
export default routers
