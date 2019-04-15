module.exports = {
  // 基本路径
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/static/custom/'
    : './',
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugins.delete('pwa')
  },
  /* devServer: { // 通过代理实现跨域请求
    proxy: {
      '/api': {
        target: 'http://alsjdlfkajlsdjf', // 真实地址
        changeOrigin: true, // 是否跨域
      }
    }
  } */
}