## build/build.js

```js
'use strict'
require('./check-versions')() // 检查node和npm版本

process.env.NODE_ENV = 'production' // 环境设置为生产环境
// https://github.com/sindresorhus/ora
const ora = require('ora') // 实现node.js命令行环境的 loading效果， 和显示各种状态的图标
// https://www.npmjs.com/package/rimraf
const rm = require('rimraf') // node环境下rm -rf的命令库
const path = require('path') // node自带包
// https://www.npmjs.com/package/chalk
const chalk = require('chalk') // 在终端中显示带颜色的文字
const webpack = require('webpack') // webpack^3.6.0包
const config = require('../config') // 引入config配置文件夹下面的index.js
const webpackConfig = require('./webpack.prod.conf') // 生产环境的配置引入

const spinner = ora('building for production...')
spinner.start() // 启动ora的loading

// 移除已经编译的文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  // 当移除文件成功，执行回调时重新打包项目
  webpack(webpackConfig, (err, stats) => {
    spinner.stop() // 停止ora 的loading
    if (err) throw err // 出错 抛出错误

    // 在编译完成的回调函数中,在终端输出编译的文件
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) { // build 失败
      console.log(chalk.red('  Build failed with errors.\n')) 
      process.exit(1) // 进程退出
    }

    console.log(chalk.cyan('  Build complete.\n')) // build 完成 
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    )) // 在终端中输出提醒文案
  })
})

```