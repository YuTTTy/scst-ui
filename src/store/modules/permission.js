import { constantRoutes, asyncRoutes } from '@/router'
import { buildMenu } from '@/api/menu'
import Layout from '@/layout/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 加载右侧菜单
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      buildMenu().then(response => {
        const { data } = response
        const accessedRoutes = filterAsyncRouter(data)
        accessedRoutes.push(...asyncRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

// 遍历后端路由配置，拼装路由对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

// 路由懒加载
export const loadView = (view) => {
  return (resolve) => require([`@/views${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
