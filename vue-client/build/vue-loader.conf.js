'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const MiniCssExtractPlugin=require('mini-css-extract-plugin'); // 文本分离插件，分离js和css
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap
/**
 *  css和stylus开发、生产依赖
 *  生产分离css
 */
const cssConfig = [isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',{
  loader: 'css-loader'
},{
  loader: 'postcss-loader',
  options: {
    sourceMap: sourceMapEnabled
  }
}];
const stylusConfig = [isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',{
  loader: 'css-loader'
},{
  loader: 'stylus-loader',
  options: {
    sourceMap: sourceMapEnabled
  }
}];

module.exports = {
  loaders: {
    css: cssConfig,
    stylus: stylusConfig
  },
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
