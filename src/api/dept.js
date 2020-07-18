import request from '@/utils/request'
import constants from '@/store/modules/constants'
const scstSystemId = constants.state.services.scstSystem

export function getDeptTree() {
  return request({
    url: scstSystemId + '/dept/tree',
    method: 'get'
  })
}

export function getDeptById(id) {
  return request({
    url: scstSystemId + `/dept/${id}`,
    method: 'get'
  })
}

export function addDept(data) {
  return request({
    url: scstSystemId + '/dept',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: scstSystemId + `/dept`,
    method: 'put',
    data
  })
}

export function deleteDept(id) {
  return request({
    url: scstSystemId + `/dept/${id}`,
    method: 'delete'
  })
}

export function checkDeptName(data) {
  return request({
    url: scstSystemId + `/dept/checkName`,
    method: 'post',
    data
  })
}
