const download = require('download-git-repo') // 模板下载使用
const chalk = require('chalk') // 字体变颜色
const ora = require('ora') // node中的进度条参数

function createProject(projectName, options) {
  // TODO: 缺少文件存在验证
  projectName = projectName || `vue-ts${Math.random()}`
  const spinner = ora(`Loading ${chalk.red('Download in progress')}`).start()
  spinner.color = 'green';
  download('lvzhifu/template_vue', projectName, { clone: true }, function (err) {
    console.log(err ? '模板加载错误' : '模板加载结束');
    if(err !== 'Error') {
      console.log('创建成功')
      spinner.succeed()
    }
  })
}

module.exports = createProject
