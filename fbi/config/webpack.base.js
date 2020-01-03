const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const eslintConfig = require('./eslint.config')

// const eslintFriendlyFormatter = require('eslint-friendly-formatter')
const opts = require('../helpers/options')()
const DataForCompile = require('./data-for-compile')
const root = process.cwd()
let templateFilepath = path.join(
  root,
  opts.paths.public || 'public',
  'index.html'
)
if (!fs.existsSync(templateFilepath)) {
  templateFilepath = templateFilepath.replace('.html', '.ejs')
}

const devModulesPath =
  ctx.nodeModulesPaths[1] || path.join(root, './node_modules')

// Babel
const babelOptions = require('../helpers/babel-options')(
  Object.assign(
    {},
    {
      babelrc: false,
      cacheDirectory: true,
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@vue/babel-plugin-transform-vue-jsx',
        '@babel/plugin-syntax-jsx'
      ]
    },
    opts.babel || {}
  ),
  devModulesPath
)

const config = {
  // context: path.resolve(__dirname, '../'),
  // entry: {
  //   app: path.resolve(__dirname, '../src/main.js')
  // },
  // output: {
  //   path: path.resolve(__dirname, '../dist/web'),
  //   filename: '[name].js',
  //   publicPath: '/'
  // },
  module: {
    rules: [
      // eslint
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [path.resolve(__dirname, '../src')],
      //   options: {
      //     formatter: eslintFriendlyFormatter,
      //     emitWarning: true
      //   }
      // },
      // vue
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'thread-loader'
          },
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      // ts
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader'
          },
          {
            loader: 'babel-loader',
            options: babelOptions
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              happyPackMode: true
            }
          }
        ]
      },
      // js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // include: [path.resolve(__dirname, '../src')]
        options: babelOptions
      },
      // img res
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
        }
      },
      // media res
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'media/[name].[hash:7].[ext]')
        }
      },
      // font res
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin(DataForCompile),
    new HtmlWebpackPlugin({
      data: DataForCompile,
      template: templateFilepath,
      filename: '../index.html'
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.vue', '.css', '.json'],
    alias: opts.alias,
    // https://github.com/benmosher/eslint-plugin-import/issues/139#issuecomment-287183200
    modules: ctx.nodeModulesPaths.concat([path.resolve(__dirname, '..', 'src')])
  },
  resolveLoader: {
    modules: ctx.nodeModulesPaths
  },
  node: {
    // 避免 webpack 注入不必要的 setImmediate polyfill 因为 Vue 已经将其包含在内
    setImmediate: false
  }
}

if (opts.lint.scripts.enable) {
  config.module.rules.push({
    test: /\.(vue|js)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    exclude: file =>
      opts.lint.scripts.exclude.some(item => new RegExp(item).test(file)),
    options: Object.assign({}, eslintConfig, opts.lint.scripts.options)
  })
}

module.exports = config
