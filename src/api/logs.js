import request from '@/utils/request'

export function getLogs(query, data) {
  return request({
    url: '/system/log/list?pageCode=' + query.page + '&pageSize=' + query.limit,
    method: 'post',
    data
  })
}

export function deleteLog(id) {
  return request({
    url: `/system/log/${id}`,
    method: 'delete'
  })
}

