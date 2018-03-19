## build/utils.js

```js
'use strict'
const path = require('path')
const config = require('../config') // 引用config文件下index.js 配置
const ExtractTextPlugin = require('extract-text-webpack-plugin') // webpack插件，抽离css样式单独打包
const packageConfig = require('../package.json')

//根据`_path`生成资源路径和文件
exports.assetsPath = function (_path) { 
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}
// css loader的配置和生成
exports.cssLoaders = function (options) { 
  options = options || {}

  const cssLoader = { // 加载css-loader配置
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = { // 加载postcss-loader配置
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  // 根据参数`loadre`生成对应的loader的配置
  function generateLoaders (loader, loaderOptions) { 
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({ // 抽离css样式
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

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
}

// Generate loaders for standalone style files (outside of .vue)
// 生成独立的样式文件
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

// 创建通知回调
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier') // node的通知包

  return (severity, errors) => { 
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({ // 编译失败，错误通知
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
```