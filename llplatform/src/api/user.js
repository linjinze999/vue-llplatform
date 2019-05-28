import { request } from '../utils/request'

export const requestLogin = params => {
  return request('/api/user/login', params)
}
