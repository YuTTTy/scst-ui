import request from '@/utils/request'

export function getLogs(query, data) {
  return request({
    url: '/logging/log/list?pageCode=' + query.page + '&pageSize=' + query.limit,
    method: 'post',
    data
  })
}

export function deleteLog(id) {
  return request({
    url: `/logging/log/${id}`,
    method: 'delete'
  })
}

