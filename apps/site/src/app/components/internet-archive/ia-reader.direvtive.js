(function () {
  'use strict';

  angular
    .module('sdaSite')
    .directive('iaReader', iaReader);

  /** @ngInject */
  function iaReader($sce, _) {
    var directive = {
      restrict: 'E',
      template: '<iframe ng-src="{{src}}">',
      replace: true,
      link: linkFunc,
      scope: {
        bookId: '=',
        page: '='
      }
    };

    return directive;

    function linkFunc(scope) {
      scope.$watchGroup(['bookId', 'page'], function (newData) {
        var newBookId = newData[0];
        var newPage = newData[1];

        //  <iframe class="reader flex" src="https://archive.org/stream/essayinanswertom00adamiala?ui=embed#page/n5/mode/2up" frameborder="0"></iframe>
        var url = buildUrl({
          scheme: 'https',
          host: 'archive.org',
          path: ['stream', newBookId],
          query: {
            ui: 'embed'
          },
          fragment: joinPath((newPage ? 'page/' + newPage : ''), 'mode/2up')
        });

        scope.src = $sce.trustAsResourceUrl(url);
      });
    }

    // TODO: the following could be extracted to a URL util service/library

    /**
     * @typedef UrlParts
     * @type {object}
     * @property {string} [scheme='http']
     * @property {string} host
     * @property {string|array} [path]
     * @property {object.<string,string>} [query]
     * @property {string} [fragment]
     */

    /**
     * Constructs a URL from the given parts
     * @param  {UrlParts} options
     * @return {string}
     */
    function buildUrl(options) {
      var parts = _.defaults(_.clone(options) || {}, {
        scheme: 'http',
        query: {}
      });

      if (!parts.host) {
        throw new Error('host option must be provided');
      }

      if (_.isArray(parts.path)) {
        parts.path = joinPath.apply(null, parts.path);
      }

      if (_.isObject(parts.query)) {
        parts.query = buildQueryString(parts.query, parts.querySep);
      }

      return parts.scheme + '://' + joinPath(parts.host, parts.path) + (parts.query ? '?' + parts.query : '') + (parts.fragment ? '#' + parts.fragment : '');
    }

    /**
     * Joins non-falsey parts of a path via a '/' separator.
     * @param {...string} part
     * @return {string}
     */
    function joinPath() {
      return _.chain(arguments)
        .map(function (arg) {
          return _.trim(arg, '\r\n\t /');
        })
        .filter()
        .join('/');
    }

    /**
     * Joins key/value pairs into a query string
     * @param  {object.<string,?string>} params
     * @param  {string} [sep='&']
     * @return {string}
     */
    function buildQueryString(params, sep) {
      sep = sep || '&';
      return _.chain(params)
        .map(function (vals, key) {
          if (!key) {
            return [];
          }

          if (!_.isArray(vals)) {
            vals = [vals];
          }

          return _.map(vals, function (val) {
            return key + (val ? '=' + val : '');
          });
        })
        .flatten()
        .filter()
        .join(sep);
    }
  }


})();
