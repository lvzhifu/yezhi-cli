const path = require('path') // 路径处理
const chalk = require('chalk') // 字体变颜色
const ora = require('ora') // node中的进度条参数
const webpack = require('webpack') // 打包工具webpack
const Config  = require('webpack-chain') // webpack 配置文件管理工具
const HtmlWebpackPlugin = require('html-webpack-plugin') // 生成HTML的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 清楚文件夹工具
const WebpackDevServer = require('webpack-dev-server') // 利用webpack
const open = require('opn') // 打开浏览器用的
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue-loade插件
// const autoprefixer = require('autoprefixer') // 自动填充
const px2rem = require('postcss-px2rem') // px 转rem

// 浏览器自动加前缀 配置
let autoProfixerConfig = { browsers: ['last 2 versions', 'Android >= 4.0', 'iOS >= 6']};

// 自动转 rem 配置 @see https://www.npmjs.com/package/postcss-px2rem  https://www.npmjs.com/package/px2rem
// 设计图的总宽度是以750px为标准，则填写75；如果是375px，则填写37.5；以此类推
let px2remConfig = { remUnit: 37.5 };
// cssnano({safe:true, zindex: false})
// let postcssOptions = [autoprefixer(autoProfixerConfig), px2rem(px2remConfig)];
const basPath = process.cwd()

function resolve(dir) {
  return path.join(basPath,  dir)
}
const config = new Config()
config.mode('development')
config.devtool('source-map')
config.entry('app').add('./src/index.js').end() // 设置的入口函数
config.output.path(path.resolve(basPath, './dist')).filename('[name].bundle.js').publicPath('/')
config.resolve.alias.set('vue$', `vue/dist/vue.esm.js`)
config.resolve.alias.set('utils', path.join(basPath,'./src/utils'))
config.resolve.alias.set('@', path.join(basPath, './src'))
config.module.rule('eslint').test(/\.(js|vue)$/)
.enforce('pre')
.include.add(path.resolve(basPath, './src')).end()
.exclude.add(/node_modules/).end()
.use('eslint').loader('eslint-loader')
.options({
  formatter: require('eslint-friendly-formatter')
})
// config.module.rule('eslint').test(/\.js$/).use('eslint').loader('eslint-loader')
// begin loader配置
// config.module.rule('eslint').test(/\.(js|vue)$/)
//   // .include
//   //   .add(path.join(basPath, './src'))
//   //   .end()
//   .use('eslint').loader('eslint-loader')
//   // .options({
//   //   formatter: require('eslint-friendly-formatter')
//   // })
config.module.rule('bablets').test(/\.js$/).use('babel').loader('babel-loader').end()
config.module.rule('cssloade')
  .test(/\.css$/)
    .use('style').loader('style-loader').end()
    .use('css').loader('css-loader').end()
    .use('postcss').loader('postcss-loader')
      .options({
        plugins: [require('autoprefixer')({ browsers: ['last 7 versions', 'Android >= 4.0', 'iOS >= 6']}), require('postcss-px2rem')({remUnit: 37.5})] // https://github.com/browserslist/browserslist 详细配置
      }).end()
config.module.rule('lessload')
  .test(/\.less$/)
    .use('style')
    .loader('style-loader')
    .end()
    .use('css')
    .loader('css-loader')
    .end()
    .use('postcss').loader('postcss-loader')
      .options({
        plugins: [require('autoprefixer')({ browsers: ['last 7 versions', 'Android >= 4.0', 'iOS >= 6']}), require('postcss-px2rem')({remUnit: 37.5})]
      }).end()
    .use('less')
    .loader('less-loader')
    .options({
      sourceMap: true
    }).end()
config.module.rule('vueload').test(/\.vue$/).use('vueload').loader('vue-loader')
config.module.rule('jpg')
  .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    .use('url-loader').loader('url-loader')
    .options({
      limit: 5,
      name: 'static/img/[name].[hash:7].[ext]'
    }).end()
config.module.rule('font')
  .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
    .use('url-loader').loader('url-loader')
    .options({
      limit: 100,
      name: 'static/fonts/[name].[hash:7].[ext]'
    }).end()
config.module.rule('json').test(/\.json$/).use('json-loader').loader('json-loader').end()

// end
config.plugin('vue-load').use(VueLoaderPlugin)


config.plugin('html-create').use(HtmlWebpackPlugin, [{
  template: path.resolve(basPath, './src/index.tp'),
  templateParameters: {
    'BASE_URL': path.resolve(basPath, './dist')
  },
  favicon: 'favicon.ico'
}])
config.plugin('clear-html').use(CleanWebpackPlugin)

// let compile = webpack(config.toConfig())
// console.log(compile)
// compile.run((err, state) => {
//   console.log(err)
// })
// console.log('jlll')
console.log(config.toString())
function projectServer (option) {
  let compile = webpack(config.toConfig())
  let serverapp = new WebpackDevServer(compile, {
    contentBase: path.resolve(basPath, './dist'),
    publicPath: '/',
    hot: true,
    overlay: {
      warnings: true,
      errors: true
    }
    // TODO: 代理配置详见地址
    // https://github.com/chimurai/http-proxy-middleware
  })

  serverapp.listen(8001, 'localhost', err => {
    if (err) {
      // TODO: 异常信息的处理
      console.log(err)
      return
    }
    open(`http://localhost:8001`)
  })


  // compile.run((err, state) => {
  //   console.log(err)
  // })
}


module.exports = projectServer


















// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const WebpackDevServer = require('webpack-dev-server')
// const open = require('opn')
// const config = new Config();
// // TODO: 这里感觉没有生效后面研究
// // .add('babel-polyfill')
// // TODO： EsModel 运行时+编译器模式
// config.mode('development')
// config.devtool('inline-source-map')
// config.entry('app').add('./src/index.js').end()
// config.output.path(path.resolve(__dirname, '../dist')).filename('[name].bundle.js').publicPath('/diss/')
// // es+
// config.module.rule('bablets').test('/\.js$/').use('babel').loader('babel-loader')
// // 设置运行时 + 编译器的vue的组件 //TODO: 后面会使用Vue-loader 看是是否可以去掉这个
// config.resolve.alias.set('vue$', `vue/dist/vue.esm.js`)
// config.plugin('html-create').use(HtmlWebpackPlugin, [{
//   template: path.resolve(__dirname, '../src/index.tp'),
//   templateParameters: {
//     'BASE_URL': path.resolve(__dirname, '../dist')
//   },
//   favicon: 'favicon.ico'
// }])
// config.plugin('clear-html').use(CleanWebpackPlugin)
// let compile = webpack(config.toConfig())
// let serverapp = new WebpackDevServer(compile, {
//   contentBase: path.resolve(__dirname, '../dist'),
//   publicPath: '/',
//   hot: true
//   // TODO: 代理配置详见地址
//   // https://github.com/chimurai/http-proxy-middleware
// })

// serverapp.listen(8001, 'localhost', err => {
//   console.log('adf')
//   console.log(open)
//   if (err) {
//     // TODO: 异常信息的处理
//     console.log(err)
//     return
//   }
//   open(`http://localhost:8001`)
// })
// compile.run((err, state) => {
//   console.log(err)
// })
