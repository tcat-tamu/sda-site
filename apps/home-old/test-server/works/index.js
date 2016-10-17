var _ = require('lodash');

var search_results = require('./search_results.json');
var works = require('./works.json');

module.exports = function (app, prefix) {

    app.get(prefix + '/works/', function (req, res, next) {
        var results = [];

        var max = parseInt(req.query.max) || 25;

        if (req.query.aid) {
            var authorId = req.query.aid;
            results = results.concat(_.filter(search_results, function (work) {
                return _.some(work.authors, { authorId: authorId });
            }));
        } else {
            results = works;
        }

        results = _.take(results, max);

        res.json(results);
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
