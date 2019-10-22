// import { asyncRoutes, constantRoutes } from '@/router'
//
// /**
//  * Use meta.role to determine if the current user has permission
//  * @param roles
//  * @param route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }
//
// /**
//  * Filter asynchronous routing tables by recursion
//  * @param routes asyncRoutes
//  * @param roles
//  */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []
//
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//
//   return res
// }
//
// const state = {
//   routes: [],
//   addRoutes: []
// }
//
// const mutations = {
//   SET_ROUTES: (state, routes) => {
//     state.addRoutes = routes
//     state.routes = constantRoutes.concat(routes)
//   }
// }
//
// const actions = {
//   generateRoutes({ commit }, roles) {
//     return new Promise(resolve => {
//       let accessedRoutes
//       if (roles.includes('admin')) {
//         accessedRoutes = asyncRoutes || []
//       } else {
//         accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
//       }
//       commit('SET_ROUTES', accessedRoutes)
//       resolve(accessedRoutes)
//     })
//   }
// }
//
// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

import { constantRoutes } from '@/router/index'
import Layout from '@/layout/index'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRoutes = routers
    state.routes = constantRoutes.concat(routers)
  }
}

const actions = {
  generateRoutes({ commit }, asyncRouter) {
    commit('SET_ROUTERS', asyncRouter)
  }
}

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
  return accessedRouters
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

