var searchResult = require('./search_result.json');
var article = require('./article.json');
var collection = require('./collections.json');

module.exports = function (app, prefix) {

   app.get(prefix + '/articles', function (req, res, next) {
       res.json(searchResult);
   });

    app.get(prefix + '/articles/:id', function (req, res, next) {
        res.json(article);
    });

    app.get(prefix + '/articles/collections/:type', function (req, res, next) {
        res.json(collection);
    });

};
