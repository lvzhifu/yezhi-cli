#!/usr/bin/env node
const program = require('commander')

program
  .version(require('../package.json').version)
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('创建您的项目文件')
  .action((projectName, cmd) => {
    require('../src/create.js')(projectName, cmd)
  })
program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
