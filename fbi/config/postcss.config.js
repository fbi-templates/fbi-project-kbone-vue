module.exports = (opts, root) => {
  return {
    useConfigFile: false,
    ident: 'postcss',
    plugins: [
      require('postcss-import')({
        root
      }),
      require('../plugins/precss')()
    ].concat(
      Object.keys(opts.postcss || {}).map(item =>
        require(`${item}`)(opts.postcss[item])
      )
    )
  }
}
