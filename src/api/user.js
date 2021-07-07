import request from '@/utils/request'
import constants from '@/store/modules/constants'
const scstSystemId = constants.state.services.scstSystem

export function getUserList(query, data) {
  return request({
    url: scstSystemId + `/user/list?page=${query.page}&limit=${query.limit}`,
    method: 'post',
    data
  })
}

export function getUserById(id) {
  return request({
    url: scstSystemId + `/user/${id}`,
    method: 'get'
  })
}

export function getUserByName(name) {
  return request({
    url: scstSystemId + `/user/info/${name}`,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: scstSystemId + '/user',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: scstSystemId + `/user/${id}`,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: scstSystemId + '/user',
    method: 'put',
    data
  })
}

export function updatePass(data) {
  return request({
    url: scstSystemId + '/updatePass',
    method: 'put',
    data
  })
}

export function getUserMenus(name) {
  return request({
    url: scstSystemId + `/user/getMenus/${name}`,
    method: 'get'
  })
}

export function checkUserName(data) {
  return request({
    url: scstSystemId + `/user/checkName`,
    method: 'post',
    data
  })
}
