const path = require('path')

function setDebug(item, mode) {
  if (item.includes('preset-env')) {
    item = [item]
    item[1] = {
      debug: Boolean(mode)
    }
  } else if (item[0].includes('preset-env')) {
    item[1] = item[1] || {}
    item[1] = Object.assign({}, item[1], {
      debug: Boolean(mode)
    })
  }
}

module.exports = (config, modulePath, mode) => {
  const babelConfig = Object.assign({}, config)

  if (babelConfig.presets && babelConfig.presets.length > 0) {
    babelConfig.presets = babelConfig.presets.map(item => {
      if (Array.isArray(item)) {
        item[0] = `${modulePath}/${item[0]}`
      } else {
        item = `${modulePath}/${item}`
      }

      setDebug(item, mode)
      return item
    })
  }

  if (babelConfig.plugins) {
    babelConfig.plugins = babelConfig.plugins.map(item => {
      if (Array.isArray(item)) {
        item[0] = path.join(modulePath, item[0])
      } else {
        item = path.join(modulePath, item)
      }
      return item
    })
  }

  return babelConfig
}
