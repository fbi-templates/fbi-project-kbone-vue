const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base')
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
      // path.join(devModulesPath, './webpack-hot-middleware/client?reload=true'),
      path.join(root, opts.paths.main || 'src/main.js'),
      hotMiddlewareScript
    ]
  },
  output: {
    path: path.join(root, opts.server.root, opts.paths.assets || 'assets'),
    filename: 'js/[name].js',
    publicPath: `/${opts.paths.assets || 'assets'}/`
  },
  // devServer: {
  //   clientLogLevel: 'warning',
  //   historyApiFallback: {
  //     rewrites: [{ from: /.*/, to: '/index.html' }]
  //   },
  //   hot: true,
  //   contentBase: false,
  //   compress: true,
  //   host: process.env.HOST || 'localhost',
  //   port: +process.env.PORT || 8080,
  //   open: true, // 自动打开浏览器
  //   overlay: { warnings: false, errors: true }, // 展示全屏报错
  //   publicPath: '/',
  //   proxy: {},
  //   quiet: true, // for FriendlyErrorsPlugin
  //   watchOptions: {
  //     poll: false
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'vue-style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: Object.keys(opts.postcss).map(item => {
                return require(`${item}`)(opts.postcss[item])
              })
            }
          },
          {
            loader: 'less-loader'
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
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // })
  ]
})

module.exports = devWebpackConfig

// module.exports = new Promise((resolve, reject) => {
//   portfinder.basePort = +process.env.PORT || 8080
//   portfinder.getPort((err, port) => {
//     if (err) {
//       reject(err)
//     } else {
//       devWebpackConfig.devServer.port = port
//       devWebpackConfig.plugins.push(
//         new FriendlyErrorsPlugin({
//           compilationSuccessInfo: {
//             messages: [
//               `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
//             ]
//           },
//           onErrors: undefined
//         })
//       )

//       resolve(devWebpackConfig)
//     }
//   })
// })
