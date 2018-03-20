'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
// https://www.npmjs.com/package/webpack-merge
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf') // webpack 基本配置
// https://www.npmjs.com/package/copy-webpack-plugin
const CopyWebpackPlugin = require('copy-webpack-plugin') // webpack复制插件
// https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin') // html模版处理插件
// https://www.npmjs.com/package/friendly-errors-webpack-plugin
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin') // webpack友好的错误提示插件
const portfinder = require('portfinder') // 检查端口

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  // https://doc.webpack-china.org/configuration/dev-server/
  devServer: { // webpack-dev-server服务器配置
    clientLogLevel: 'warning', // 在开发工具的控制台将显示消息
    historyApiFallback: { // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.  告诉服务器从哪里提供内容。false: 禁用
    compress: true, // 一切服务都启用gzip压缩 
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser, // 是否自动打开浏览器
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true } 
      : false, // 当有编译器错误或警告时，在浏览器中显示全屏覆盖。默认禁用。 { warnings: false, errors: true } 不显示警告 显示错误
    publicPath: config.dev.assetsPublicPath, // 公共资源路径配置
    proxy: config.dev.proxyTable, // 本地服务器代理配置
    quiet: true, // necessary for FriendlyErrorsPlugin  启用quiet后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    watchOptions: { // 与监视文件相关的控制选项。
      poll: config.dev.poll,  // 通过传递true开启轮询，或者指定毫秒为单位进行轮询
    }
  },
  plugins: [ // 插件配置
    new webpack.DefinePlugin({ // webpack 自带的插件
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(), // webpack 自带的插件
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update. // webpack 自带的插件
    new webpack.NoEmitOnErrorsPlugin(), // webpack 自带的插件
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({ // html模版处理配置
      filename: 'index.html', // 生成文件
      template: 'index.html', // 模版文件
      inject: true //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
    }),
    // copy custom static assets
    new CopyWebpackPlugin([ // 复制插件 ， 只要时复制static文件夹中文件到config.dev.assetsSubDirectory文件夹下
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*'] //忽视.*文件
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => { 
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({ // 本地服务运行
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined  // 编译错误通知回调
      }))

      resolve(devWebpackConfig)
    }
  })
})
