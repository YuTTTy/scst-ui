import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/user/logout',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/system/user/info',
    method: 'get',
    params: { token }
  })
}

export function getUsers(query, data) {
  return request({
    url: `/system/user/list?page=${query.page}&limit=${query.limit}`,
    method: 'post',
    data
  })
}

export function findUser(id) {
  return request({
    url: `/system/user/${id}`,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/system/user/${id}`,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data
  })
}

export function getUserMenus(name) {
  return request ({
    url: `/system/user/getMenus/${name}`,
    method: 'get',
  })
}

export function checkUserName(name, id) {
  return request ({
    url: `/system/user/checkName/${name}/${id}`,
    method: 'get'
  })
}
