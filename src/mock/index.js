import Mock from 'mockjs'

export default {
  mockData () {
    Mock.mock('/api/user', {
      'success': true,
      'result': {
        'id': '100001',
        'name': '林锦泽',
        'roles': ['admin']
      }
    })
  }
}
