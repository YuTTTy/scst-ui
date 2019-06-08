import request from '@/utils/request'

export function getDepts() {
  return request({
    url: '/system/dept/list',
    method: 'get'
  })
}

export function getDeptTree() {
  return request({
    url: '/system/dept/tree',
    method: 'get'
  })
}

export function findDept(id) {
  return request({
    url: `/system/dept/${id}`,
    method: 'get'
  })
}

export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: `/system/dept`,
    method: 'put',
    data
  })
}

export function deleteDept(id) {
  return request({
    url: `/system/dept/${id}`,
    method: 'delete'
  })
}

export function checkDeptName(name, id) {
  return request ({
    url: `/system/dept/checkName/${name}/${id}`,
    method: 'get'
  })
}
