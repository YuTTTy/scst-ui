const baseUrl = process.env.VUE_APP_BASE_API
/**
 * 一些非ajax方式的请求接口
 */
const api = {
  state: {
    // 七牛云文件上传API
    qiNiuUploadApi: baseUrl + '/api/qiniu/upload',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html'
  }
}

export default api
