var _ = require('lodash');

var search_results = require('./search_results.json');
var people = require('./people.json');

module.exports = function (app, prefix) {

    app.get(prefix + '/people', function (req, res) {
        var syntheticName = req.query.syntheticName.toLowerCase();
        if (syntheticName === '') {
            res.json([]);
        }

        var nameRE = new RegExp(syntheticName, 'i');
        var max = parseInt(req.query.max) || 50;

        var results = [];

        // familyName
        var lastNameMatches = _.filter(search_results, function (person) {
            return nameRE.test(person.displayName.familyName);
        });

        results = results.concat(lastNameMatches);

        // givenName
        var firstNameMatches = _.filter(search_results, function (person) {
            return nameRE.test(person.displayName.givenName);
        });

        results = results.concat(firstNameMatches);

        // displayName
        var fullNameMatches = _.filter(search_results, function (person) {
            return nameRE.test(person.displayName.displayName);
        });

        results = results.concat(fullNameMatches);

        // remove duplicates (keep first occurrence) and limit number returned
        results = _.take(_.uniq(results), max);

        res.json(results);
    });

    app.get(prefix + '/people/:id', function (req, res) {
        var person = _.findWhere(people, { id: req.params.id });

        if (person) {
            res.json(person);
        } else {
            res.status(404).send();
        }
    })

}
