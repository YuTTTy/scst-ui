import request from '@/utils/request'
import constants from '@/store/modules/constants'
const scstSystemId = constants.state.services.scstSystem

export function buildMenu() {
  return request({
    url: scstSystemId + '/menu/build',
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: scstSystemId + '/menu/tree',
    method: 'get'
  })
}

export function getMenuById(id) {
  return request({
    url: scstSystemId + `/menu/${id}`,
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: scstSystemId + '/menu',
    method: 'post',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: scstSystemId + `/menu/${id}`,
    method: 'delete'
  })
}

export function updateMenu(data) {
  return request({
    url: scstSystemId + '/menu',
    method: 'put',
    data
  })
}

export function checkMenuName(name, id) {
  return request({
    url: scstSystemId + `/menu/checkName/${name}/${id}`,
    method: 'get'
  })
}
