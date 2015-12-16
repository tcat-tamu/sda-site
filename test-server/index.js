var express = require('express');

var article = require('./article.json');
var collection = require('./collections.json');

var app = express();

var root = '/catalog/services';

app.get(root + '/articles/:id', function (req, res, next) {
    res.json(article);
});

app.get(root + '/articles/collections/:type/', function (req, res, next) {
    res.json(collection)
});

app.get(root + '/articles/collections/:type/:id', function (req, res, next) {
    var subCollection = findSubCollection(req.params.id);

    if (subCollection) {
        res.json(subCollection);
    } else {
        res.status(404).send();
    }

    /**
     * BFS for collection node with given ID
     *
     * @param string id
     * @return Node
     */
    function findSubCollection(id) {
        var worklist = [collection];

        while (worklist.length > 0) {
            var node = worklist.shift();

            if (node.id === id) {
                return node;
            } else if (node.children) {
                worklist = worklist.concat(node.children);
            }
        }

        return null;
    }
});

var server = app.listen(9999, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening on %s:%s', host, port);
})
