var express = require('express')
var path = require('path')
var favicon = require('static-favicon')
var logger = require('morgan')
var geoip = require('geoip-lite')
var dns = require('dns')

var routes = require('./routes/index')
var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(favicon())
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.set('jsonp callback name', 'jsonp');

function isIp(name) {
  return name.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
}

app.use(function(req, res, next) {

  req.json = req.query.jsonp || req.xhr || !req.accepts('html')

  res.locals = {
    ip: req.ip
    , host: req.query.host || req.ip
  }

  if (res.locals.host) {
    if (isIp(res.locals.host)) {
      res.locals.geo = geoip.lookup(res.locals.host)
      next()
    } else {
      // no ip address, resolve it and call geoip later
      dns.resolve4(res.locals.host, function(err, address) {
        if (err) return next(err)
        if (address[0]) {
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
