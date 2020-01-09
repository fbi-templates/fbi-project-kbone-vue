const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base')
const postcssConfig = require('./postcss.config')
const opts = require('../helpers/options')()

const root = process.cwd()
const script =
  'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
const hotMiddlewareScript = ctx.nodeModulesPaths[1]
  ? path.join(ctx.nodeModulesPaths[1], script)
  : script

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  entry: {
    app: [
      path.join(root, opts.paths.main || 'src/main.js'),
      hotMiddlewareScript
    ]
  },
  output: {
    path: path.join(root, opts.server.root, opts.paths.assets || 'assets'),
    filename: 'js/[name].js',
    publicPath: `/${opts.paths.assets || 'assets'}/`
  },
  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
          {
            loader: 'vue-style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'vue-style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: postcssConfig(opts, root)
          }
        ]
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // 开启 HMR 的时候使用该插件会显示模块的相对路径
    new webpack.NoEmitOnErrorsPlugin()
  ]
})

module.exports = devWebpackConfig
