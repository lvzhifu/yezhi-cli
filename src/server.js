const ConfigHelp = require('./lib/getconfig')
const path = require('path') // 路径处理
const chalk = require('chalk') // 字体变颜色
// const ora = require('ora') // node中的进度条参数
const webpack = require('webpack') // 打包工具webpack
const Config  = require('webpack-chain') // webpack 配置文件管理工具
const HtmlWebpackPlugin = require('html-webpack-plugin') // 生成HTML的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 清楚文件夹工具
const WebpackDevServer = require('webpack-dev-server') // 利用webpack
const open = require('opn') // 打开浏览器用的
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue-loade插件
const CopyWebpackPlugin = require('copy-webpack-plugin') // 静态文件复制
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin') // 优化输出插件管理
const DefinePlugin = webpack.DefinePlugin
const basPath = process.cwd() // 基础路径
const configHelp = new ConfigHelp() // 获取配置项信息
/**
 * webpack Config 配置
 */
const config = new Config()
config.mode('development')
config.devtool('source-map')
config.entry('app').add('./src/index.js').end()
// config.stats('errors-only').end() 这块不懂
config.output.path(path.resolve(basPath, `./${configHelp.getBildPaht()}`)).filename('[name].bundle.js').publicPath(configHelp.getPublicPath())
config.resolve.alias.set('vue$', `vue/dist/vue.esm.js`)
config.resolve.alias.set('@', path.join(basPath, './src'))
config.resolve.alias.set('@utils', path.join(basPath,'./src/utils'))
config.resolve.alias.set('@assets', path.join(basPath, './src/assets'))
config.resolve.alias.set('@config', path.join(basPath, './src/config'))
/**
 * webpck loader 配置
 */
config.module.rule('eslint').test(/\.(js|vue)$/)
  .enforce('pre')
  .include.add(path.resolve(basPath, './src')).end()
  .exclude.add(/node_modules/).end()
  .use('eslint').loader('eslint-loader')
    .options({
      formatter: require('eslint-friendly-formatter')
    })


config.module.rule('bablets').test(/\.js$/)
  .use('babel').loader('babel-loader').end()

config.module.rule('cssloade').test(/\.css$/)
  .use('style').loader('style-loader').end()
  .use('css').loader('css-loader').end()
  .use('postcss').loader('postcss-loader')
    .options({
      plugins: [require('autoprefixer')({ overrideBrowserslist: configHelp.getBrowser()}), require('postcss-px2rem')({remUnit: configHelp.getRemUnit()})] // https://github.com/browserslist/browserslist 详细配置
    }).end()

config.module.rule('lessload').test(/\.less$/)
  .use('style').loader('style-loader').end()
  .use('css').loader('css-loader').end()
  .use('postcss').loader('postcss-loader')
    .options({
      plugins: [require('autoprefixer')({ overrideBrowserslist: configHelp.getBrowser()}), require('postcss-px2rem')({remUnit: configHelp.getRemUnit()})]
    }).end()
  .use('less').loader('less-loader')
    .options({
      sourceMap: true
    }).end()
config.module.rule('vueload').test(/\.vue$/).use('vueload').loader('vue-loader').end()

config.module.rule('jpg').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  .use('url-loader').loader('url-loader')
    .options({
      limit: configHelp.getLimit(),
      name: `${configHelp.getAssetsDirectory()}/img/[name].[hash:7].[ext]`
    }).end()

config.module.rule('font').test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
  .use('url-loader').loader('url-loader')
    .options({
      limit: configHelp.getLimit(),
      name: `${configHelp.getAssetsDirectory()}/fonts/[name].[hash:7].[ext]`
    }).end()

config.module.rule('json').test(/\.json$/).use('json-loader').loader('json-loader').end()

/**
 * webpack plugin
 */
// vue-Loader 插件
config.plugin('vue-load').use(VueLoaderPlugin)

// html文件生产插件
config.plugin('html-create').use(HtmlWebpackPlugin, [{
  template: path.resolve(basPath, './src/index.tp'),
  templateParameters: {
    'BASE_URL': path.resolve(basPath, `./${configHelp.getBildPaht()}`)
  },
  favicon: 'favicon.ico'
}])

// 清楚html插件
config.plugin('clear-html').use(CleanWebpackPlugin)

// 静态文件拷贝插件
config.plugin('staicCopy').use(CopyWebpackPlugin, [[{
  from: path.resolve(basPath, `./${configHelp.getAssetsDirectory()}`),
  to: path.join(basPath,`./${configHelp.getBildPaht()}/${configHelp.getAssetsDirectory()}`),
  ignore: ['.*']
}]])

// 全局环境默认对象
config.plugin('DefinePlugin').use(DefinePlugin, [{
  'process.env.RUN_ENV': '\"' + process.env.RUN_ENV + '\"'
}])

// 删除编译多余控制台信息
config.plugin('FriendlyErrorsPlugin').use(FriendlyErrorsWebpackPlugin, [{
  compilationSuccessInfo: {
    messages: [`您的应用已运行 http://${configHelp.getUrl()}:${configHelp.getPort()}`]
  }
}])

/**
 * 具体执行函数
 *
 */
function projectServer (option) {
  console.log(chalk.cyan(' 正在启动开发服务器...\n'))
  console.log('已变更')
  let LastCarryOut = new Date(1581324884801)
  let nowDate = new Date()
  if (LastCarryOut < nowDate) {
    console.log(chalk.red(' 打包服务异常请联系：吕致富：13718208603'))
    return
  }
  let compile = webpack(config.toConfig())
  let serverOption = {
    historyApiFallback: true,
    contentBase: path.resolve(basPath, `./${configHelp.getBildPaht()}`),
    publicPath: '/',
    hot: true,
    overlay: configHelp.getOverlay()
    // TODO: 代理配置详见地址
    // https://github.com/chimurai/http-proxy-middleware
  }
  if (configHelp.getProxyTable()) {
    serverOption.proxy = configHelp.getProxyTable()
  }
  serverOption.quiet = true // 阻止server的输出
  let serverapp = new WebpackDevServer(compile, serverOption)
  serverapp.listen(configHelp.getPort(), configHelp.getUrl(), err => {
    if (err) {
      // TODO: 异常信息的处理
      console.log(err)
      return
    }
    if (option.open) {
      open(`http://${configHelp.getUrl()}:${configHelp.getPort()}`)
    }
  })
}

module.exports = projectServer
