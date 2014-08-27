var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.json) {
    res.json( {
      success: res.locals.geo !== null,
      geoip: res.locals.geo
    })
  } else {
    res.render('index', { title: 'Express' });
  }
})

module.exports = router;
