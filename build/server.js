'use strict'
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev')
const config = require('./config')
const LogPlugin = require('./log-plugin')
var request = require('request');
var rp = require('request-promise-native');

const app = express()

const port = config.port
webpackConfig.entry.client = [
  `webpack-hot-middleware/client?reload=true`,
  webpackConfig.entry.client
]

webpackConfig.plugins.push(new LogPlugin(port))

let compiler

try {
  compiler = webpack(webpackConfig)
} catch (err) {
  console.log(err.message)
  process.exit(1)
}

const devMiddleWare = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
app.use(devMiddleWare)
app.use(require('webpack-hot-middleware')(compiler, {
  log: () => {}
}))

const mfs = devMiddleWare.fileSystem
const file = path.join(webpackConfig.output.path, 'index.html')


devMiddleWare.waitUntilValid()
app.get('/api/token', function (req, res) {
  var auth = {
        url        : 'https://developer.api.autodesk.com/authentication/v1/authenticate',
        method : 'POST',
        headers    : {'Content-Type': 'application/x-www-form-urlencoded'},
        form       : {
                        client_id     : config.CLIENT_ID,
                        client_secret : config.CLIENT_SECRET,
                        grant_type    : 'client_credentials',
                        scope         : 'data:read bucket:read'
                    }
      }

  rp(auth)
    .then(function (autodeskResponse) {
      return JSON.parse(autodeskResponse) }) //autodeskResponse é o retorno da autenticação, que vem em formato json mas texto simples, por isso o parse
    .then(function (json){
          res.json(json); //envia a resposta como json
      });
});
  
app.get('*', (req, res) => {
  devMiddleWare.waitUntilValid(() => {
    const html = mfs.readFileSync(file)
    res.end(html)
  })
})

app.listen(port)
