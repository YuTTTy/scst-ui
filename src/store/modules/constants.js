/**
 * 一些常量值
 */
const constants = {
  state: {
    /**
     * 后端微服务模块路由地址
     * 在微服务项目中，前端仅需要记住网关服务IP地址即可，而前端的请求根据path的不同由Gateway自动查询注册中心并请求请求转发到指定的服务模块
     * 通常在Gateway中配置了不同的path前缀转发到不同的服务中
     * 那么这里记录了不同服务的前缀路由地址。
     * `/src/api/login.js`中`/user/login`的请求URL组成是什么？
     * `/user/login` = baseUrl + sctAuth + '/user/login' = 'http://127.0.0.1:9999/auth/user/login'
     */
    services: {
      scstAuth: '/auth',
      scstSystem: '/system'
    }
  }
}

export default constants
