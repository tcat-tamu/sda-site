var relationships = require('./relationships.json');
var types = require('./types.json');

module.exports = function (app, prefix) {

    app.get(prefix + '/relationships', function (req, res, next) {
        res.json(relationships);
    });

    app.get(prefix + '/relationships/types', function (req, res, next) {
        res.json(types);
    });

};
