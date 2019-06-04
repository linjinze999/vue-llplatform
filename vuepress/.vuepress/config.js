module.exports = {
  dest: 'docs',
  base: '/vue-llplatform/',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'vue-llplatform',
      description: '基于Vue + Element搭建一个后台管理项目'
    }
  },
  head: [
    ['link', {rel: 'icon', href: `/logo.png`}],
    ['link', {rel: 'manifest', href: '/manifest.json'}],
    ['meta', {name: 'theme-color', content: '#3eaf7c'}],
    ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
    ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}],
    ['link', {rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png`}],
    ['link', {rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c'}],
    ['meta', {name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png'}],
    ['meta', {name: 'msapplication-TileColor', content: '#000000'}],
    ['script', {src: '/assets/js/article.js'}],
    ['script', {src: 'https://hm.baidu.com/hm.js?cb0f8a7853566f66e39ee136bc02bdb5'}],
    ['link', {rel: 'stylesheet', href: '/assets/css/common.css'}]
  ],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    repo: 'linjinze999/vue-llplatform',
    docsRepo: 'linjinze999/vue-llplatform',
    docsDir: 'vuepress',
    editLinks: true,
    sidebarDepth: 0,
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '帮我改进此页',
        lastUpdated: '上次更新',
        nav: [
          {
            text: '文档',
            link: '/docs/',
          },
          {
            text: '源码',
            link: 'https://github.com/linjinze999/vue-llplatform/tree/vue-cli3/llplatform',
          },
          {
            text: '在线预览',
            link: 'https://linjinze999.github.io/vue-llplatform/preview/#/login',
          },
          {
            text: '支持一下',
            link: '/support/',
          },
        ],
        sidebar: {
          '/docs/': [
            '',
            {
              title: '项目',
              collapsable: false,
              children: [
                {
                  title: '基础',
                  collapsable: false,
                  children: [
                    'project/start',
                    'project/config',
                    'project/request',
                    'project/login',
                    'project/permission',
                    'project/layout',
                    'project/pages',
                    'project/language',
                    'project/theme',
                    'project/build',
                  ]
                },
                {
                  title: '进阶',
                  collapsable: false,
                  children: [
                    'project/store',
                    'project/import',
                    'project/performance',
                  ]
                }
              ]
            },
            'docker/start'
          ],

        }
      }
    }
  }
};
