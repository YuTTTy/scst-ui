import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: 'github',
    component: Layout,
    children: [
      {
        path: 'https://github.com/TyCoding/cloud-template',
        meta: { title: '项目地址', icon: 'github3' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: {
      title: '权限管理',
      icon: 'setting'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index'),
        name: 'user',
        meta: { title: '用户管理', icon: 'peoples' }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role/index'),
        name: 'role',
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'permission',
        component: () => import('@/views/system/permission/index'),
        name: 'permission',
        meta: { title: '权限管理', icon: 'permission' }
      },
      {
        path: 'menu',
        component: () => import('@/views/system/menu/index'),
        name: 'menu',
        meta: { title: '菜单管理', icon: 'menu' }
      },
      {
        path: 'dept',
        component: () => import('@/views/system/dept/index'),
        name: 'dept',
        meta: { title: '部门管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/monitor',
    component: Layout,
    name: 'monitor',
    meta: {
      title: '系统监控',
      icon: 'monitor'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'online',
        component: () => import('@/views/monitor/online'),
        name: 'online',
        meta: { title: '在线用户', icon: 'online' }
      },
      {
        path: 'logs',
        component: () => import('@/views/monitor/logs'),
        name: 'logs',
        meta: { title: '操作日志', icon: 'log' }
      },
      {
        path: 'loginLog',
        component: () => import('@/views/monitor/loginLog'),
        name: 'loginLog',
        meta: { title: '登录日志', icon: 'login-log' }
      },
      {
        path: 'errorLog',
        component: () => import('@/views/monitor/errorLog'),
        name: 'errorLog',
        meta: { title: '错误日志', icon: 'error-log' }
      },
      {
        path: 'redis',
        component: () => import('@/views/monitor/redis'),
        name: 'redis',
        meta: { title: 'Redis监控', icon: 'redis' }
      },
    ]
  },

  {
    path: '/cloud',
    component: Layout,
    name: 'cloud',
    meta: {
      title: 'Spring Cloud',
      icon: 'springcloud'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/cloud/admin'),
        name: 'admin',
        meta: { title: '服务监控', icon: 'service-monitor' }
      },
      {
        path: 'zipkin',
        component: () => import('@/views/cloud/zipkin'),
        name: 'zipkin',
        meta: { title: '链路监控', icon: 'zipkin' }
      },
      {
        path: 'eureka',
        component: () => import('@/views/cloud/eureka'),
        name: 'eureka',
        meta: { title: '注册中心', icon: 'service-center' }
      },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
