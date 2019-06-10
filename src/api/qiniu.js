import request from '@/utils/request'

export function getFiles(query, data) {
  return request({
    url: `/component/qiniu/list`,
    method: 'post',
    data
  })
}

export function deleteFile(id) {
  return request({
    url: `/component/qiniu/${id}`,
    method: 'delete'
  })
}

export function updateFile(data) {
  return request({
    url: '/component/qiniu',
    method: 'put',
    data
  })
}
