import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { buildMenus } from '@/api/menu'
import { filterAsyncRouter } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        // no roles, get user info before load menu tree
        try {
          // // get user info
          // // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // const { roles } = await store.dispatch('user/getInfo')
          //
          // // generate accessible routes map based on roles
          // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          //
          // // dynamically add accessible routes
          // router.addRoutes(accessRoutes)
          //
          // // hack method to ensure that addRoutes is complete
          // // set the replace: true, so the navigation will not leave a history record
          // next({ ...to, replace: true })

          // get user info
          store.dispatch('user/getInfo').then(res => {
            // load menu tree
            loadMenus(next, to)
          }).catch(error => {
            store.dispatch('user/logout').then(() => {
              location.reload()
            })
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// load menu tree from api
export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    const asyncRouter = filterAsyncRouter(res.data)
    // asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('permission/generateRoutes', asyncRouter).then(() => {
      router.addRoutes(asyncRouter)
      next({ ...to, replace: true })
    })
  })
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
