import request from '@/utils/request'
import constants from '@/store/modules/constants'
const scstSystemId = constants.state.services.scstSystem

export function getLogList(query, data) {
  return request({
    url: scstSystemId + `/log/list?page=${query.page}&limit=${query.limit}`,
    method: 'post',
    data
  })
}

export function deleteLog(id) {
  return request({
    url: scstSystemId + `/log/${id}`,
    method: 'delete'
  })
}

