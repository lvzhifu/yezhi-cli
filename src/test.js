const { runCLI } = require('jest') // 获取jest 测试运行器

/**
 * 具体执行函数
 *
 */
function projectTest () {
  const testObj = runCLI({},['tests'])
  testObj.then((obj) => {
    console.log('测试执行完成')
    console.log(obj.results.success)
  })
}

module.exports = projectTest
