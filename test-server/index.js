var express = require('express');

var app = express();

var root = '/catalog/services';

services = [
    './articles',
    './copies',
    './people',
    './relationships',
    './works'
];

services.forEach(function (s) {
    require(s)(app, root);
});

var server = app.listen(9999, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening on %s:%s', host, port);
})
