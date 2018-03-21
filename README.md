# vue2_config

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## vue project configure 

### config folder

#### config/dev.env.js

```js
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"' // node环境为开发环境
})
```

[config/dev.env.js](https://github.com/freeshineit/vue2_config/tree/master/README/config/dev.env)

#### config/prod.env.js

```js
module.exports = {
  NODE_ENV: '"production"'  // node环境为生产环境
}
```

[config/prod.env.js](https://github.com/freeshineit/vue2_config/tree/master/README/config/prod.env)

#### config/index.js

development

```js
  dev: { //开发环境配置项
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
    useEslint: true, // 是否开启eslint代码检查
    // if 值为true，eslint显示错误和警告的错误也将被覆盖
    // 在浏览器中.
    showEslintErrorsInOverlay: false, 
    //...
  }
```
production

```js
  build: { // 生产环境配置项
    index: path.resolve(__dirname, '../dist/index.html'),  // 打包生成模版
    assetsRoot: path.resolve(__dirname, '../dist'), // 打包根路径
    assetsSubDirectory: 'static', // 打包静态资源地址 
    assetsPublicPath: '/', // 公共路径
    // 能够提供将压缩文件恢复到源文件原始位置的映射代码的方式，这意味着你可以在优化压缩代码后轻松的进行调试
    productionSourceMap: true, // sourcemap
    // ...
  }
```

[config/index.js](https://github.com/freeshineit/vue2_config/tree/master/README/config/index)

### build folder

#### build/build.js

```js
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

[build/build.js](https://github.com/freeshineit/vue2_config/tree/develop/README/build/build)

#### build/utils.js

```js
//根据`_path`生成资源路径和文件
exports.assetsPath = function (_path) { 
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}
//...

// https://vue-loader.vuejs.org/en/configurations/extract-css.html
// 要使用动态样式语言,你可下载下面几种less、sass、stylus
// 例如安装less执行: npm i -S less less-loader
// 就可以使用less了
return { 
css: generateLoaders(),
postcss: generateLoaders(),
less: generateLoaders('less'),
sass: generateLoaders('sass', { indentedSyntax: true }),
scss: generateLoaders('sass'),
stylus: generateLoaders('stylus'),
styl: generateLoaders('stylus')
}
//...
```

[build/utils.js](https://github.com/freeshineit/vue2_config/tree/develop/README/build/utils)

#### build/vue-loader.conf.js

```js
// 是vue-loader的一些配置项
module.exports = {
  // 调用utils工具类生成样式loader的配置
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  // ...
}
```
[build/vue-loader.conf.js](https://github.com/freeshineit/vue2_config/tree/develop/README/build/vue-loader.conf)

#### build/webpack.base.conf.js

```js
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
  }
  //...
}
```

[build/webpack.base.conf.js](https://github.com/freeshineit/vue2_config/tree/develop/README/build/webpack.base.conf)

#### build/webpack.dev.conf.js

```js
const devWebpackConfig = merge(baseWebpackConfig, {
    // ...
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
  ],
  // ...
})
```

[build/webpack.dev.conf.js](https://github.com/freeshineit/vue2_config/tree/develop/README/build/webpack.dev.conf)

#### build/webpack.prod.conf.js

```js
const webpackConfig = merge(baseWebpackConfig, {
    // ...
  output: { // 生成环境 编译输出文件
    path: config.build.assetsRoot, // 导出文件目录
    filename: utils.assetsPath('js/[name].[chunkhash].js'), //导出js文件名，文件名带有chunkhash码
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') // 非入口文件的文件名，而又需要被打包出来的文件命名配置,如按需加载的模块
  },
  plugins: [ // webpack 插件配置
    new webpack.DefinePlugin({
      'process.env': env  //配置全局环境为生产环境
    }),
    new UglifyJsPlugin({ // js代码压缩插件
      uglifyOptions: {
        compress: { // 代码压缩配置
          warnings: false  // 是否显示警告， false 不显示
        }
      },
      sourceMap: config.build.productionSourceMap,  // 是否生产sourcemap文件
      parallel: true  // 并行
    }),
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
    // 生成在 `dist` 文件下 `index.html`
    // 你可以通过编辑/ index.html自定义输出（自定义模版中到内容）
    new HtmlWebpackPlugin({
      filename: config.build.index,  // 生成到文件名
      template: 'index.html', // 模版（当模版不存在时，生产文件时虽然生成了，但是有点问题）
      inject: true, //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
      minify: { // html压缩配置
        removeComments: true, //移除html中的注释
        collapseWhitespace: true, // 移除html中的空格
        removeAttributeQuotes: true //移除html元素中属性的引号
      },
      chunksSortMode: 'dependency' // 按照依赖的顺序引入
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
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
    // 运行时模块提取webpack表现为了自己的文件以防止每当应用程序包更新vendor文件哈希被更新
    // 下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // 本实例代码分块，将它们捆在一个单独的块中提取共享块，类似于vendor文件的块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
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
```

[build/webpack.prod.conf.js](https://github.com/freeshineit/vue2_config/tree/develop/README/build/webpack.prod.conf)
