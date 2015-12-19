var _ = require('lodash');

var works = require('./works.json');

module.exports = function (app, prefix) {

    app.get(prefix + '/works/', function (req, res, next) {
        res.json(works);
    });

    app.get(prefix + '/works/:id', function (req, res, next) {
        var work = _.findWhere(works, { id: req.params.id });

        if (work) {
            res.json(work);
        } else {
            res.status(404).send();
        }
    });

};
