const path = require('path') // 路径处理
const basPath = process.cwd()
const baseconfig = require(path.join(basPath, './yezi.js'))

class configHelp{
  constructor(){
  }
  // 获取屏幕
  getRemUnit(){
   return baseconfig.remUnit || 37.5
  }
  // 获取eslint显示
  getOverlay() {
    return baseconfig.overlay || {
      warnings: true,
      errors: true
    }
  }
  // 获取url
  getUrl() {
    return baseconfig.host || 'localhost'
  }
  // 获取端口信息
  getPort() {
    return baseconfig.port || 9001
  }
  // 获取浏览器前缀信息
  getBrowser() {
    return baseconfig.browsers || ['last 7 versions', 'Android >= 4.0', 'iOS >= 6']
  }
  // 获取资源文件
  getAssetsDirectory() {
    return baseconfig.assetsSubDirectory || 'static'
  }
  // 获取build基础路径
  getPublicPath() {
    if (process.env.RUN_MODE === 'serve') {
      return '/'
    }
    return baseconfig.assetsPublicPath || '/'
  }
  // 获取打包文件存放路径
  getBildPaht() {
    return baseconfig.saveFile || 'dist'
  }
  // 获取代理信息
  getProxyTable() {
    return baseconfig.proxyTable
  }
  // 获取Base64转换限制
  getLimit() {
    return baseconfig.limit || 5000
  }
}

module.exports = configHelp
