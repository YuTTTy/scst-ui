import request from '@/utils/request'

export function getMenus(query, data) {
  return request({
    url: '/system/menu/list?pageCode=' + query.page + '&pageSize=' + query.limit,
    method: 'post',
    data
  })
}

export function getMenuTree() {
  return request({
    url: '/system/menu/tree',
    method: 'get'
  })
}

/**
 * 获取左侧菜单权限Tree
 */
export function buildMenus() {
  return request({
    url: '/system/menu/build',
    method: 'get',
  })
}

export function findMenu(id) {
  return request({
    url: `/system/menu/${id}`,
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/system/menu/${id}`,
    method: 'delete'
  })
}

export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data
  })
}

export function checkMenuName(name, id) {
  return request ({
    url: `/system/menu/checkName/${name}/${id}`,
    method: 'get'
  })
}

