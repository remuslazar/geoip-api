var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  if (req.json) {
    res.jsonp(
      res.locals.geo ?
        {
          success: true,
          geoip: res.locals.geo
        } : res.locals.ips ?
        {
          success: false,
          error: { code: 1, message: 'No geoip data available' }
        } : {
          success: false,
          error: { code: 2, message: 'No IPv4 DNS record found' }
        }

    )

  } else {
    res.render('index')
  }
})

module.exports = router
