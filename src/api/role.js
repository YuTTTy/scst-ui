import request from '@/utils/request'

export function getRoles(query, data) {
  return request({
    url: `/role/list?page=${query.page}&limit=${query.limit}`,
    method: 'post',
    data
  })
}

export function findRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
