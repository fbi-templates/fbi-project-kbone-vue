const path = require('path')

// 浏览器兼容配置 https://github.com/browserslist/browserslist#best-practices
const targets = {
  browserslist: ['last 2 versions', 'ie >= 10']
}

function resolve (dir) {
  return path.join(process.cwd(), dir)
}

module.exports = {
  paths: {
    // 小程序入口文件
    mpEntries: {
      home: resolve('src/mp/home/main.mp.js'),
      other: resolve('src/mp/other/main.mp.js')
    },
    mpDist: 'dist/mp',
    main: 'src/main.js',
    public: 'public',
    assets: 'assets'
  },

  server: {
    root: 'dist/web',
    host: 'localhost',
    port: 8888,
    proxy: {
      '/proxy': 'https://api.github.com'
    }
  },

  // Compile time data (Valid only in js code)
  data: {
    all: {
      // for all environments
      __KEY__: ''
    },
    // `fbi s`
    dev: {
      __APIROOT__: '/proxy'
    },
    // `fbi b -test`
    test: {
      __APIROOT__: 'https://api.github.com'
    },
    // `fbi b` or `fbi b -p`
    prod: {
      __APIROOT__: 'https://api.github.com'
    }
  },

  // Resolve alias
  // e.g: import '../../components/x' => import '@/components/x'
  alias: {
    '@': resolve('src'),
    vue: resolve('node_modules/vue/dist/vue.esm.js'),
    vuex: resolve('node_modules/vuex/dist/vuex.esm.js'),
    'vue-router': resolve('node_modules/vue-router/dist/vue-router.esm.js'),
    'vuex-router-sync': resolve('node_modules/vuex-router-sync/index.js')
  },

  // Webpack module noParse
  // Docs: https://webpack.js.org/configuration/module/#module-noparse
  noParse: content => {
    return false
  },

  sourcemap: 'source-map',

  // ESlint config
  eslint: {
    enable: true,
    options: {
      rules: {
        // rules docs: https://standardjs.com/rules.html
      }
    }
  },

  // 静态检查
  lint: {
    scripts: {
      enable: true,
      options: {
        // http://eslint.org/docs/user-guide/configuring
        rules: {
          // rules docs: https://standardjs.com/rules.html
        }
        // fix: true,
        // emitError: true,
        // emitWarning: true
      },
      exclude: [/node_modules/]
    }
  },

  // babel-loader options
  // Docs: https://github.com/babel/babel-loader/tree/7.x#options
  babel: {
    babelrc: false,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: targets.browserslist,
          corejs: '2',
          useBuiltIns: 'entry'
          // debug: true
        }
      ]
    ]
  },

  // Postcss config (plugin-name: plugin-options)
  postcss: {
    // https://github.com/postcss/autoprefixer#options
    // https://github.com/ai/browserslist#queries
    autoprefixer: { overrideBrowserslist: targets.browserslist },
    precss: {}
  },

  // 配置参考：https://wechat-miniprogram.github.io/kbone/docs/config/
  kbone: {
    origin: 'https://test.miniprogram.com',
    entry: '/',
    router: {
      home: ['/(home|index)?', '/index.html', '/test/(home|index)'],
      other: ['/test/list/:id', '/test/detail/:id']
    },
    redirect: {
      notFound: 'home',
      accessDenied: 'home'
    },
    generate: {
      autoBuildNpm: 'npm'
    },
    app: {
      backgroundTextStyle: 'dark',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: 'kbone'
    },
    appExtraConfig: {
      sitemapLocation: 'sitemap.json'
    },
    global: {
      share: true,
      windowScroll: false,
      backgroundColor: '#F7F7F7'
    },
    pages: {},
    optimization: {
      domSubTreeLevel: 10,

      elementMultiplexing: true,
      textMultiplexing: true,
      commentMultiplexing: true,
      domExtendMultiplexing: true,

      styleValueReduce: 5000,
      attrValueReduce: 5000
    },
    projectConfig: {
      projectname: 'kbone-template-vue',
      appid: ''
    }
  }
}
