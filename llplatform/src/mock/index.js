import Mock from 'mockjs'

export default {
  mockData () {
    const BASE_PATH = process.env.BASE_URL.endsWith('/')
      ? process.env.BASE_URL.substr(0, process.env.BASE_URL.length - 1)
      : process.env.BASE_URL
    Mock.mock(BASE_PATH + '/api/user/login', {
      'code': 1,
      'token': 'fdsjfhjkdshfkldsajfjasdfbjsdkfhsdajfj',
      'result': {
        'id': '100001',
        'name': '林锦泽',
        'roles': ['admin']
      }
    })
    Mock.mock(BASE_PATH + '/api/user/register', {
      'code': 1
    })
    Mock.mock(BASE_PATH + '/api/user/info', {
      'code': 1,
      'id': '100001',
      'name': '林锦泽',
      'roles': ['admin'],
      'permissions': [
        {
          // 一个页面权限一个对象，name为静态路由表里面的name
          name: 'index'
        }, {
          name: 'table'
        }, {
          name: 'formsBase'
        }, {
          name: 'formsEdit'
        }, {
          name: 'charts'
        }, {
          name: 'drag'
        }, {
          name: 'userPassword'
        }, {
          name: 'userPermissions'
        }, {
          name: 'about'
        }
      ]
    })
    Mock.mock('/api/user/changePassword', {
      'code': 1,
      'token': 'fdsjfhjkdshfkldsajfjasdfbjsdkfhsdajfj'
    })
    Mock.mock('/api/user/query', {
      'code': 1,
      'data|30-60': [
        {
          'name|1': [Mock.mock('@cname'), Mock.mock('@cname'), Mock.mock('@cname'), Mock.mock('@cname')],
          'date|1': [Mock.mock('@date("yyyy-MM-dd")'), Mock.mock('@date("yyyy-MM-dd")'), Mock.mock('@date("yyyy-MM-dd")')],
          'address|1': [Mock.mock('@county(true)'), Mock.mock('@county(true)'), Mock.mock('@county(true)')]
        }
      ]
    })
    Mock.mock('/api/user/permissions', {
      'code': 1,
      'permissions': {
        users: [
          {
            id: 1,
            name: '张三',
            role_ids: [1, 3]
          }, {
            id: 2,
            name: '李四',
            role_ids: [2, 3]
          }, {
            id: 3,
            name: '王五',
            role_ids: [3]
          }
        ],
        roles: [
          {
            id: 1,
            name: '管理员',
            page_ids: [1, 2],
            directive_ids: [1, 2]
          }, {
            id: 2,
            name: '普通用户',
            page_ids: [1, 2],
            directive_ids: [1]
          }, {
            id: 3,
            name: '登录用户',
            page_ids: [1],
            directive_ids: []
          }
        ],
        pages: [
          {
            id: 1,
            name: '表格',
            path: '/tables'
          }, {
            id: 2,
            name: '图表',
            path: '/charts'
          }
        ],
        directive: [
          {
            id: 1,
            name: 'modify',
            page_id: 1
          }, {
            id: 2,
            name: 'delete',
            page_id: 1
          }
        ]
      }
    })
  }
}
