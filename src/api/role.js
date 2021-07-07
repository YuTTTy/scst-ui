import request from '@/utils/request'
import constants from '@/store/modules/constants'
const scstSystemId = constants.state.services.scstSystem

export function getRoleList(query, data) {
  return request({
    url: scstSystemId + `/role/list?page=${query.page}&limit=${query.limit}`,
    method: 'post',
    data
  })
}

export function getRoleFilterList(data) {
  return request({
    url: scstSystemId + `/role/filter/list`,
    method: 'post',
    data
  })
}

export function getRoleById(id) {
  return request({
    url: scstSystemId + `/role/${id}`,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: scstSystemId + '/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: scstSystemId + `/role`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: scstSystemId + `/role/${id}`,
    method: 'delete'
  })
}

export function checkRoleName(data) {
  return request({
    url: scstSystemId + `/role/checkName`,
    method: 'post',
    data
  })
}
