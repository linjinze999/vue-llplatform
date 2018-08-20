import {request} from '../utils/request'

export const requestLogin = params => {
  return request('/api/user/login', params)
}

export const requestUserInfo = params => {
  return request('/api/user/info', params).then((data) => {
    sessionStorage.setItem('user-info', JSON.stringify(data))
    return data
  })
}
