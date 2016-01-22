var _ = require('lodash');

var copies = require('./copies.json');

module.exports = function (app, prefix) {

    app.get(prefix + '/copies/works/:id', function (req, res, next) {
        res.json(copies);
    });

    app.get(prefix + '/copies/:id', function (req, res, next) {
        var copy = _.findWhere(copies, {id: req.params.id});

        if (copy) {
            res.json(copy);
        } else {
            res.status(404).send();
        }
    })

};
