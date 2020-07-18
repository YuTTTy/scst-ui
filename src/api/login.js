import request from '@/utils/request'
import constants from '@/store/modules/constants'
const scstAuthId = constants.state.services.scstAuth
const scstSystemId = constants.state.services.scstSystem

export function login(data) {
  return request({
    url: scstAuthId + '/oauth/token',
    method: 'post',
    params: {
      username: data.username,
      password: data.password,
      grant_type: 'password'
    },
    headers: {
      'Authorization': 'Basic Y2xpZW50OnNlY3JldA=='
    }
  })
}

export function getInfo(token) {
  return request({
    url: scstSystemId + '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: scstAuthId + '/token/logout',
    method: 'delete',
    params: { token }
  })
}
