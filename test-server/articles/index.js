var article = require('./article.json');
var collection = require('./collections.json');

module.exports = function (app, prefix) {

    app.get(prefix + '/articles/:id', function (req, res, next) {
        res.json(article);
    });

    app.get(prefix + '/articles/collections/:type/', function (req, res, next) {
        res.json(collection);
    });

    app.get(prefix + '/articles/collections/:type/:id', function (req, res, next) {
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

};
