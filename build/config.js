'use strict'
const pkg = require('../package')

module.exports = {
  port: 4000,
  title: 'veturpack',
  // when you use electron please set to relative path like ./
  // otherwise only set to absolute path when you're using history mode
  publicPath: '/',
  CLIENT_ID: process.env.CLIENT_ID || 'KiBrx6pRDrpUVB4ELA3zJj3PAh99REug',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'Tx1eeUPGeCCt9P7g'
}
