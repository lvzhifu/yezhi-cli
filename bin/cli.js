#!/usr/bin/env node
const program = require('commander') // 命令行参数获取
const chalk = require('chalk') // 字体变色chalk

// console.log(process.execPath)
// console.log(process.cwd())
// console.log(__filename)
// console.log(__dirname)
program
  .version(require('../package.json').version)
  .usage('<command> [options]')

// 项目创建
program
  .command('create [app-name]')
  .description('创建您的项目文件')
  .action((projectName, cmd) => {
    require('../src/create.js')(projectName, cmd)
  })

// 开发服务启动
program
  .command('serve')
  .description('运行开发服务')
  .option('-o, --open', 'Open browser', false)
  .option('-e, --env <type>', 'Run time', 'dev')
  .action((cmd) => {
    process.env.RUN_ENV = cmd.env
    process.env.RUN_MODE = 'serve'
    require('../src/server.js')(cmd)
  })

// 开发服务启动
program
  .command('build')
  .description('打包您的服务')
  .option('-e, --env <type>', 'Run time', 'pro')
  .option('-t, --test <type>', 'Run time')
  .action((cmd) => {
    process.env.RUN_ENV = cmd.env
    process.env.RUN_MODE = 'build'
    require('../src/build.js')(cmd)
  })
// 测试服务
program
  .command('test')
  .description('执行您的单元测试')
  .action(() => {
    require('../src/test.js')()
  })
// program
//   .command('tsser')
//   .action(() => {
//     require('../src/webservicets.js')
//   })

  program.on('--help', function(){
    console.log(chalk.yellow('  Examples:'))
    console.log(chalk.green('   $ yezhi create test-app'))
    console.log(chalk.green('   $ yezhi server --open'))
    console.log(chalk.green('   $ yezhi test '))
  })
program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
