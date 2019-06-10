import request from '@/utils/request'

export function getDepts() {
  return request({
    url: '/system/dept/list',
    method: 'get'
  })
}

/**
 * 发送邮件接口
 * @param data
 */
export function sendEmail(data) {
  return request({
    url: '/component/mail/',
    method: 'post',
    data
  })
}
