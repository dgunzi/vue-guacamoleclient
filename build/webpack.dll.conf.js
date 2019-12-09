'use strict'
const path = require('path')
const webpack = require('webpack')
const rootPath = path.resolve(__dirname, '../');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry:  {
    'vueLibs': ['vue-router', 'vue', 'vuex'],
    'commonLibs': ['lodash', 'axios']
  },
  output: {
    path: path.join(rootPath, 'static/js/dll'),
    filename: '[name]_dll.js',
    library: "[name]_[hash]"
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(rootPath, "static/js/dll", "[name]-manifest.json"),
      name: "[name]_[hash]"
    })
  ]
}
