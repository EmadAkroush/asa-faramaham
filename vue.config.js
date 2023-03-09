'use strict'
var path = require('path')
const webpack = require('webpack');
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    configureWebpack: {
        resolve: {
          alias: {
            '@': path.resolve(__dirname, 'src'),
            '~': path.resolve(__dirname, 'public'),
          }
        },
        plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)]
      }
}
