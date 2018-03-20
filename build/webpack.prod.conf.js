'use strict'
const path = require('path')
const utils = require('./utils') // 工具类
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge') // 对象合并
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin') // 文件复制插件
const HtmlWebpackPlugin = require('html-webpack-plugin') // html 处理插件
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 文本提起插件
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin') // css优化插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')  // js 压缩插件

const env = require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ // 样式相关loader配置
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: { // 生成环境 编译输出文件
    path: config.build.assetsRoot, // 导出文件目录
    filename: utils.assetsPath('js/[name].[chunkhash].js'), //导出js文件名，文件名带有chunkhash码
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') // 非入口文件的文件名，而又需要被打包出来的文件命名配置,如按需加载的模块
  },
  plugins: [ // webpack 插件配置
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env  //配置全局环境为生产环境
    }),
    // http://www.css88.com/doc/webpack2/plugins/uglifyjs-webpack-plugin/
    new UglifyJsPlugin({ // js代码压缩插件
      uglifyOptions: {
        compress: { // 代码压缩配置
          warnings: false  // 是否显示警告， false 不显示
        }
      },
      sourceMap: config.build.productionSourceMap,  // 是否生产sourcemap文件
      parallel: true  // 并行
    }),
    // extract css into its own file
    new ExtractTextPlugin({ // 抽取css 样式表 单独打包
      filename: utils.assetsPath('css/[name].[contenthash].css'), // 导出css文件名，文件名带有contenthash码
      //设置下面选项为`false`不会从代码分割块中提取CSS。
      //他们的CSS将被插入style-loader时，代码分割块通过webpack已加载
      //它的当前设置为`true`, 因为我们看到sourcemaps都包括在代码分割bundle, 以及当它的`假`增加文件大小
      // https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,  // 所有块
    }),
    // 压缩提取的CSS。我们正在使用这个插件，使之成为可能
    // 重复的CSS从不同的组件可以被删除（deduped）
    new OptimizeCSSPlugin({  // 压缩抽取到css
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // 生成在 `dist` 文件下 `index.html`
    // 你可以通过编辑/ index.html自定义输出（自定义模版中到内容）
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,  // 生成到文件名
      template: 'index.html', // 模版（当模版不存在时，生产文件时虽然生成了，但是有点问题）
      inject: true, //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
      minify: { // html压缩配置
        removeComments: true, //移除html中的注释
        collapseWhitespace: true, // 移除html中的空格
        removeAttributeQuotes: true //移除html元素中属性的引号
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency' // 按照依赖的顺序引入
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // 分离公共js到vendor文件中去
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', // 文件名
      minChunks (module) { //声明公共的模块来自node_modules文件夹
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 运行时模块提取webpack表现为了自己的文件以防止每当应用程序包更新vendor文件哈希被更新
    // 下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // 本实例代码分块，将它们捆在一个单独的块中提取共享块，类似于vendor文件的块
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    // 复制指定文件静态资源, 下面将static文件内的复制静态资源内容复制到指定文件夹
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
// 判断是否开启gzip压缩（要是开启，需要服务器进行配置使用）
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]', // 目标文件
      algorithm: 'gzip', // 使用压缩格式，这里使用gzip压缩
      test: new RegExp( //满足正则表达式的文件会被压缩
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240, //当资源文件大于10240B时会被压缩
      minRatio: 0.8  //最小压缩比达到0.8时才会被压缩
    })
  )
}

if (config.build.bundleAnalyzerReport) { // 是否开启打包分析报告
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
