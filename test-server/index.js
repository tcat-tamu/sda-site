var express = require('express');

var app = express();

var root = '/catalog/services';

require('./articles')(app, root);
require('./copies')(app, root);
require('./relationships')(app, root);
require('./works')(app, root);

var server = app.listen(9999, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening on %s:%s', host, port);
})
