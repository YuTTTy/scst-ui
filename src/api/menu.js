import request from '@/utils/request'

export function getMenus(query, data) {
  return request({
    url: '/menu/list?pageCode=' + query.page + '&pageSize=' + query.limit,
    method: 'post',
    data
  })
}

/**
 * 获取菜单权限Tree
 */
export function getTree() {
  return request({
    url: '/menu/tree',
    method: 'get'
  })
}

export function findMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  })
}

export function updateMenu(data) {
  return request({
    url: '/menu/edit',
    method: 'put',
    data
  })
}

