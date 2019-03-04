module.exports = {
  proxyTable: {
    '/api' : {
      target: 'http://localhost:3000',
      pathRewrite: {'^/api': ''},
      secure: true,
      changeOrigin: true
    }
  }
}