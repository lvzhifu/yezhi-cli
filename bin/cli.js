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

program
  .command('create [app-name]')
  .description('创建您的项目文件')
  .action((projectName, cmd) => {
    require('../src/create.js')(projectName, cmd)
  })

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

program
  .command('build')
  .description('打包您的服务')
  .option('-e, --env <type>', 'Run time', 'pro')
  .action((cmd) => {
    process.env.RUN_ENV = cmd.env
    process.env.RUN_MODE = 'build'
    require('../src/build.js')()
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
  })
program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
