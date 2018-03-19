### config/index.js

```js
'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: { //开发环境配置项

    // Paths
    assetsSubDirectory: 'static', // 虚拟静态资源地址
    assetsPublicPath: '/', 
    proxyTable: {}, // 服务器代理

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // 本地服务器开启的端口。如果被占用,则会自动开启一个端
    autoOpenBrowser: false, // 服务开启是否自动打开浏览器
    errorOverlay: true, // 是否错误叠加
    notifyOnErrors: true, // 是否通知错误
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true, // 是否开启eslint代码检查
    // if 值为true，eslint显示错误和警告的错误也将被覆盖
    // 在浏览器中.
    showEslintErrorsInOverlay: false, 

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true, // 是否清除缓存

    cssSourceMap: true // css样式是否有sourcemap
  },

  build: { // 生产环境配置项
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),  // 打包生成模版

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'), // 打包根路径
    assetsSubDirectory: 'static', // 打包静态资源地址 
    assetsPublicPath: '/', // 公共路径

    /**
     * Source Maps
     */
    // 能够提供将压缩文件恢复到源文件原始位置的映射代码的方式，这意味着你可以在优化压缩代码后轻松的进行调试
    productionSourceMap: true, // sourcemap
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:  在设置下面为 `true`,请确认执行下面指令
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, // 是否开启 gzip
    productionGzipExtensions: ['js', 'css'], // 需要使用 gzip 压缩的文件扩展名

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`  执行这个命令会开启本地服务器 打开一个报告页面
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report 
  }
}

```