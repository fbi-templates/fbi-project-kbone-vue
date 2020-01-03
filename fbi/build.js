process.env.NODE_ENV = 'production'
const webpack = require('webpack')
const statsConfig = require('./config/stats.config')
const opts = require('./helpers/options')()

// Get task params
const taskParams = ctx.task.getParams('build')

// Set environment
ctx.isProd = true
ctx.env = taskParams.t || taskParams.test ? 'test' : 'prod'
ctx.target = taskParams.web ? 'web' : 'mp'
ctx.logger.log(`Env: ${ctx.env},`, `Target: ${ctx.target}`)

function buildWeb () {
  // Target root
  ctx.options.server.root = ctx.options.server.root || 'dist'
  ctx.logger.log(`Root: ${ctx.options.server.root}`)

  const webpackConfigWeb = require('./config/webpack.prod')
  return new Promise((resolve, reject) => {
    webpack(webpackConfigWeb, (err, stats) => {
      if (err) {
        reject(err)
      }

      console.log(stats.toString(statsConfig))
      resolve()
    })
  })
}

function buildMp () {
  // Target root
  ctx.logger.log(`Root: ${opts.paths.mpDist}`)

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

module.exports = ctx.target === 'web' ? buildWeb : buildMp
