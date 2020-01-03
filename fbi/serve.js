const path = require('path')
const http = require('http')
const express = require('express')
const webpack = require('webpack')
const proxy = require('http-proxy-middleware')
const statsConfig = require('./config/stats.config')

process.env.NODE_ENV = 'development'

// Get task params
const taskParams = ctx.task.getParams('serve')

// Set environment
ctx.env =
  taskParams.t || taskParams.test
    ? 'test'
    : taskParams.p || taskParams.prod
    ? 'prod'
    : 'dev'
ctx.target = taskParams.web ? 'web' : 'mp'
ctx.logger.log(`Env: ${ctx.env},`, `Target: ${ctx.target}`)

// Service start port
let startPort = taskParams.port || ctx.options.server.port

function server () {
  // Webpack config
  const webpackConfigWeb = require('./config/webpack.dev')
  const webpackOptions = {
    publicPath: webpackConfigWeb.output.publicPath,
    stats: statsConfig
  }

  return new Promise((resolve, reject) => {
    const app = express()

    const compiler = webpack(webpackConfigWeb)
    const devMiddleWare = require('webpack-dev-middleware')(
      compiler,
      webpackOptions
    )

    // proxy
    const proxyOptions = ctx.options.server.proxy
    if (proxyOptions) {
      for (let p in proxyOptions) {
        app.use(
          proxy(p, {
            target: proxyOptions[p],
            changeOrigin: true,
            pathRewrite: path => {
              return path.replace(p, '/')
            }
          })
        )
      }
    }

    app.use(devMiddleWare)
    app.use(require('webpack-hot-middleware')(compiler))

    app.get('*', (req, res) => {
      const fs = devMiddleWare.fileSystem
      devMiddleWare.waitUntilValid(() => {
        res.end(
          fs.readFileSync(
            path.join(webpackConfigWeb.output.path, '../index.html')
          )
        )
      })
    })

    devMiddleWare.waitUntilValid(() => resolve(app))
  })
}

function listen (app) {
  return new Promise((resolve, reject) => {
    let port = startPort
    startPort += 1
    const server = http.createServer(app)

    server.listen(port, err => {
      server.once('close', () => {
        app.listen(port, err => {
          return err ? reject(err) : resolve(port)
        })
      })
      server.close()
    })
    server.on('error', err => {
      ctx.logger.warn(`Port ${port} is already in use, trying ${startPort}...`)
      resolve(listen(app))
    })
  })
}

async function serveWeb () {
  try {
    const app = await server()
    const port = await listen(app)
    ctx.logger.info(
      `Server runing at http://${ctx.options.server.host}:${port}`
    )
  } catch (err) {
    ctx.logger.error(err)
  }
}

function serveMp () {
  process.env.isMiniprogram = true
  const webpackConfigMp = require('./config/webpack.mp')
  return new Promise((resolve, reject) => {
    webpack(webpackConfigMp, (err, stats) => {
      if (err) {
        reject(err)
      }

      console.log(stats.toString(statsConfig))
      resolve()
    })
  })
}

module.exports = ctx.target === 'web' ? serveWeb : serveMp
