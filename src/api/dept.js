import request from '@/utils/request'

export function getDepts() {
  return request({
    url: '/dept/list',
    method: 'get'
  })
}

export function getDeptTree() {
  return request({
    url: '/dept/tree',
    method: 'get'
  })
}

export function addDept(data) {
  return request({
    url: '/dept',
    method: 'post',
    data
  })
}

export function updateDept(id, data) {
  return request({
    url: `/dept/${id}`,
    method: 'put',
    data
  })
}

export function deleteDept(id) {
  return request({
    url: `/dept/${id}`,
    method: 'delete'
  })
}
