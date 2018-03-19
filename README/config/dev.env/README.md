## config/dev.env.js

```js
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env') 

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"' // node环境为开发环境
})

```