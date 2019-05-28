const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

process.env.VUE_APP_VERSION = process.env.BUILD_NUMBER || '-'

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // 设置路径别名
      .set('@pages', resolve('src/views/pages')) // 设置路径别名
  },
  devServer: {
    proxy: (() => {
      if (!process.env.VUE_APP_BACK_END_URL) {
        return false
      } else {
        // 代理转发
        const _basePath = process.env.VUE_APP_BASE_PATH.endsWith('/')
          ? process.env.VUE_APP_BASE_PATH
          : process.env.VUE_APP_BASE_PATH + '/'
        const _path = _basePath + 'api/'
        const result = {}
        result[_path] = {
          target: process.env.VUE_APP_BACK_END_URL,
          changeOrigin: true,
          pathRewrite: {}
        }
        result[_path].pathRewrite['^' + _path] = '/'
        return result
      }
    })()
  },
  publicPath: process.env.VUE_APP_BASE_PATH || '/' // 系统路径
}
