import request from '@/utils/request'

export function getRoles(query, data) {
  return request({
    url: `/system/role/list?page=${query.page}&limit=${query.limit}`,
    method: 'post',
    data
  })
}

export function findRole(id) {
  return request({
    url: `/system/role/${id}`,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/system/role`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/system/role/${id}`,
    method: 'delete'
  })
}

export function checkRoleName(name, id) {
  return request ({
    url: `/system/role/checkName/${name}/${id}`,
    method: 'get'
  })
}
