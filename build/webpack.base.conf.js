'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) { // 路径设置
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({ // 创建语法检查规则 使用eslint语法检查
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')], // 需要检查的文件夹
  options: {
    formatter: require('eslint-friendly-formatter'), // 一个友好的eslint语法格式化检查的插件 
    emitWarning: !config.dev.showEslintErrorsInOverlay // 是否在浏览器中提示eslint语法错误
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: { // 入口文件
    app: './src/main.js'
  },
  output: { // 编译输出文件
    path: config.build.assetsRoot, //导出目录的绝对路径
    filename: '[name].js', //导出文件的文件名
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath //生产模式或开发模式下html、js等文件内部引用的公共路径
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'], //自动解析确定的拓展名,使导入模块时可以不带拓展名
    alias: { // 创建import或require的别名 方便简写导入路径
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []), // eslint-loader 配置
      {
        test: /\.vue$/,       // 处理文件后缀为.vue的文件
        loader: 'vue-loader',  // 使用vue-loader处理
        options: vueLoaderConfig, //options是对vue-loader做的额外选项配置,
        exclude: [resolve('node_modules')] // 排除node_modules文件夹
      },
      {
        test: /\.js$/,  // 处理文件后缀为.js的文件
        loader: 'babel-loader', // 使用babel-loader处理
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,  // 处理图片图形的文件
        loader: 'url-loader', // 使用url-loader处理
        options: { 
          limit: 10000, //图片小于10000字节时以base64的方式引用
          name: utils.assetsPath('img/[name].[hash:7].[ext]') // 经由url-loader处理的文件，会被放置在img文件夹下，文件名后添加一个7位hash
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 处理媒体
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 处理字体
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
