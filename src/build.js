const ConfigHelp = require('./lib/getconfig')
const path = require('path') // 路径处理
const chalk = require('chalk') // 字体变颜色
const ora = require('ora') // node中的进度条参数
const webpack = require('webpack') // 打包工具webpack
const Config  = require('webpack-chain') // webpack 配置文件管理工具
const HtmlWebpackPlugin = require('html-webpack-plugin') // 生成HTML的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 清楚文件夹工具
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue-loade插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css 提取插件防止包过大
const optimizeCss = require('optimize-css-assets-webpack-plugin') // css 压缩
const CopyWebpackPlugin = require('copy-webpack-plugin') // 静态文件复制
const basPath = process.cwd() // 基础路径
const configHelp = new ConfigHelp() // 获取配置项信息

/**
 * webpack Config 配置
 */
const config = new Config()
config.mode('production')
config.entry('app').add('./src/index.js').end()
config.output.path(path.resolve(basPath, `./${configHelp.getBildPaht()}`)).filename(`${configHelp.getAssetsDirectory()}/js/[name].[chunkhash:8].js`).publicPath(configHelp.getPublicPath())
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
.use('style').loader(MiniCssExtractPlugin.loader).end()
  .use('css').loader('css-loader').end()
  .use('postcss').loader('postcss-loader')
    .options({
      plugins: [require('autoprefixer')({ overrideBrowserslist: configHelp.getBrowser()}), require('postcss-px2rem')({remUnit: configHelp.getRemUnit()})] // https://github.com/browserslist/browserslist 详细配置
    }).end()

config.module.rule('lessload').test(/\.less$/)
.use('style').loader(MiniCssExtractPlugin.loader).end()
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
config.plugin('vue-load').use(VueLoaderPlugin)

config.plugin('cssfl').use(MiniCssExtractPlugin, [{
  filename: `${configHelp.getAssetsDirectory()}/css/[name].[contenthash:7].css`
}])

config.plugin('compressCSS').use(optimizeCss, [{
  assetNameRegExp: /\.css$/g,
  cssProcessor: require('cssnano'),
  canPrint: true
}])

config.plugin('staicCopy').use(CopyWebpackPlugin, [[{
  from: path.resolve(basPath, `./${configHelp.getAssetsDirectory()}`),
  to: path.join(basPath,`./${configHelp.getBildPaht()}/${configHelp.getAssetsDirectory()}`),
  ignore: ['.*']
}]])

config.plugin('html-create').use(HtmlWebpackPlugin, [{
  template: path.resolve(basPath, './src/index.tp'),
  templateParameters: {
    'BASE_URL': path.resolve(basPath, `./${configHelp.getBildPaht()}`)
  },
  favicon: 'favicon.ico'
}])

config.plugin('clear-html').use(CleanWebpackPlugin)


function projectBuild (option) {
  const spinner = ora('build 开始...')
  spinner.start()
  let compile = webpack(config.toConfig())
  compile.run((err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    console.log(chalk.cyan('  Build 完成.\n'))
    console.log(chalk.yellow('  Tip: 请在nginx 下访问 直接打开的方式不可以哦.\n'))
  })
}

module.exports = projectBuild
