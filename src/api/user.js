import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/oauth/token',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function getUsers(query, data) {
  return request({
    url: `/user/list?page=${query.page}&limit=${query.limit}`,
    method: 'post',
    data
  })
}

export function findUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function getUserMenus(name) {
  return request ({
    url: `/user/getMenus/${name}`,
    method: 'get',
  })
}

export function checkUserName(name, id) {
  return request ({
    url: `/user/checkName/${name}/${id}`,
    method: 'get'
  })
}
