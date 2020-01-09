const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const postcssConfig = require('./postcss.config')
const opts = require('../helpers/options')()

const noop = function () {}
const root = process.cwd()
const staticPath = path.join(root, opts.paths.public)
const needCopy = fs.existsSync(staticPath)

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    app: path.join(root, opts.paths.main || 'src/main.js')
  },
  output: {
    path: path.join(root, opts.server.root, opts.paths.assets || 'assets'),
    filename: 'js/[name].[chunkhash:8].js',
    publicPath: `./${opts.paths.assets || 'assets'}/`
  },
  // For development, use cheap-module-eval-source-map. For production, use cheap-module-source-map.
  devtool: opts.sourcemap || false,
  optimization: {
    splitChunks: {
      // 代码分割配置
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      // 压缩CSS
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true
              }
            }
          ]
        },
        canPrint: false
      }),
      // 压缩 js
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              modules: true
            }
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
            loader: MiniCssExtractPlugin.loader
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
  plugins: [
    new ProgressBarPlugin(),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CleanWebpackPlugin(),
    // 分离 css 文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css'
    }),
    // 当 vendor 模块没有改变时，保证模块 id 不变
    new webpack.HashedModuleIdsPlugin(),
    // optimize module ids by occurrence count
    new webpack.optimize.OccurrenceOrderPlugin(),
    needCopy
      ? new CopyWebpackPlugin([
          {
            from: staticPath,
            to: '../',
            ignore: ['.*', 'index.ejs']
          }
        ])
      : noop
  ]
})

module.exports = webpackConfig
