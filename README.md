GeoIP Lookup Web-GUI and API
============================

This is a simple [Express4](http://expressjs.com) / node.js based
Web-GUI/API to lookup and display the info from the GeoLite Database,
which is available for free usage from http://maxmind.com/.

For Web-Browsers (or other clients which accept HTML) there is a
simple GUI, for other clients or Ajax-Requests the data will be
returned JSON formatted.

By default the Client IP-Address will be used for the lookup, but a
different hostname/ip can be also optionally supplied.


Parameters
----------

The Web-GUI uses a simple HTML form performing a `GET` request.  There
is only one parameter available called `host`, which can be used for
supplying a hostname or an IP-address.

When not using a Web-Browser, do supply the data as an URL Parameter,
e.g. `GET /?host=79.250.123.182`

Notice: When using a hostname, only the first resolved IPv4 address
will be used for the GeoIP lookup.

JSONP Support
-------------

Support for [JSONP](http://en.wikipedia.org/wiki/JSONP) requests is
available. Simply provide the name of the callback function as a query
parameter called `jsonp` (see example section below)

Example
-------

### Regular API-Call

```
$ curl -H accept:application/json http://localhost:3000/?host=www.google.com | prettyjson

success: true
geoip:
  range:
    - 2915172352
    - 2915237887
  country: US
  region:  CA
  city:    Mountain View
  ll:
    - 37.4192
    - -122.0574
```

### JSONP Request

For JSON usage specify the callback function using the `callback` query
parameter.

```
curl 'http://localhost:3000/?host=www.google.com&callback=geoip'

typeof geoip === 'function' && geoip({"success":true,"geoip":{"range":[2915172352,2915237887],"country":"US","region":"CA","city":"Mountain View","ll":[37.4192,-122.0574]}});
```

### Success state and error codes using the JSON API

Successful requests will return a JSON object with the `success` key
set to `true`. Else, `error.code` and `error.message` will be returned
(see below)

#### Success, GeoIP data available

```
{
	"success": true,
	"geoip": <GeoIP data, see the example above>
}
```

#### DNS lookup failure

```
{
	"success": false,
	"error": {
		"code": 1,
		"message": "No IPv4 DNS record found"
	}
}
```

#### No GeoIP data available

```
{
	"success": false,
	"error": {
		"code": 2,
		"message": "No geoip data available"
	}
}
```

Technical Details
-----------------

This API uses the node-geoip module, which itself includes the GeoLite
database (the data will be downloaded/installed after the npm install
step automatically).

References
----------

1. [node-geoip library](https://github.com/bluesmoon/node-geoip)


Copyright
---------

`geoip-api` is Copyright 2014 Remus Lazar <remus@lazar.info> and the
latest version of the code is available at
https://github.com/remuslazar/geoip-api


License
-------

There are two licenses for the code and data. See the LICENSE file for details.
