var express = require('express')
var path = require('path')
var favicon = require('static-favicon')
var logger = require('morgan')
var geoip = require('geoip-lite')
var dns = require('dns')

var routes = require('./routes/index')
var app = express()
var packageJson = require('./package.json')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(favicon())
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))

// enable proxy support
if (process.env.PROXY)
  app.enable('trust proxy')

function isIp(name) {
  return name.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) || // ipv4
  name.match(/^[0-9a-f:]{5,}$/i) // ipv6
}

app.use(function(req, res, next) {

  req.json = req.query.callback || req.xhr || !req.accepts('html')

  // if proxy support is enabled, use the first provided ip
  // in the proxy chain.
  var ip = app.get('trust proxy') && req.ips && req.ips.length ?
    req.ips[req.ips.length-1] : req.ip

  res.locals = {
    ip: ip
    , host: req.query.host || ip // use client ip by default
    , packageJson: packageJson
  }

  if (res.locals.host) {
    if (isIp(res.locals.host)) {
      res.locals.ips = [ res.locals.host ]
      res.locals.geo = geoip.lookup(res.locals.host)
      next()
    } else {
      // no ip address, resolve it and call geoip later
      dns.resolve4(res.locals.host, function(err, address) {
        if (err && err.code !== 'ENOTFOUND')
          return next(err)
        if (address && address[0]) {
          res.locals.geo = geoip.lookup(address[0])
          res.locals.ips = address
        }
        next()
      })
    }
  }

})

app.use('/', routes)

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

/// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    if (req.json) return res.jsonp({success: false, error: err})
    res.render('error', {
        message: err.message,
        error: {}
    })
})


module.exports = app
