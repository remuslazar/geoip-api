GeoIP Lookup Web-GUI and API
============================

This is a simple [Express4](http://expressjs.com) / node.js based
Web-GUI/API to lookup and display the info from the GeoLite Database,
which is available for free usage from http://maxmind.com/.

For Web-Browsers (or other clients which accept HTML) there is a
simple GUI, for other clients or Ajax-Requests the data will be
returned JSON formatted.

Default the Client IP-Address will be used for the lookup, but a
different hostname/ip can be also used.


Parameters
----------

The Web-GUI uses a simple HTML form performing a `GET` request.  There
is only one parameter available called `host`, which can be used for
supplying a hostname or an IP-address.

When not using a Web-Browser, do supply the data as an URL Parameter,
e.g. `GET /?host=79.250.123.182`

Notice: When using a hostname, only the first resolved IPv4 address
will be used for the GeoIP lookup.


Example
-------

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
