var _ = require('lodash');

var work = require('./work.json');
var works = require('./works.json');

module.exports = function (app, prefix) {

    app.get(prefix + '/works/', function (req, res, next) {
        res.json(works);
    });

    app.get(prefix + '/works/:id', function (req, res, next) {
        res.json(work);
    });

};
