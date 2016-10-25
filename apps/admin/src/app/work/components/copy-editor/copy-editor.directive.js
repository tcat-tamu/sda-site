(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('copyEditor', copyEditorDirective);

  /** @ngInject */
  function copyEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/work/components/copy-editor/copy-editor.html',
      scope: {
        copy: '=ngModel'
      },
      controller: CopyEditorController,
      controllerAs: 'vm'
    };

    return directive;
  }

  /** @ngInject */
  function CopyEditorController($scope) {
    var vm = this;

    vm.refHandlers = {};
    vm.setProperties = parseProperties;

    activate();

    function activate() {
      addHandler(HathiTrustRefHandler());
      addHandler(GoogleBooksRefHandler());
      addHandler(InternetArchiveRefHandler());
    }

    function addHandler(handler) {
      vm.refHandlers[handler.id] = handler;
    }

    function parseProperties(type, url) {
      if (vm.refHandlers[type]) {
        $scope.copy.properties = vm.refHandlers[type](url);
      }

      $scope.copyForm.url.$setValidity(type, $scope.copy.properties != null);
    }
  }

  // https://archive.org/details/essayinanswertom00adamiala
  // <iframe src='https://archive.org/stream/essayinanswertom00adamiala?ui=embed#page/n7/mode/1up' width='480px' height='430px' frameborder='0' ></iframe>
  // TODO add support for resources from OpenLibrary
  // https://openlibrary.org/books/OL7186607M/An_essay_in_answer_to_Mr._Hume's_Essay_on_miracles.

  /**
   * A reference parse handler to support digital copies from the Internet
   * Archive.
   */
  function InternetArchiveRefHandler() {
    function handle(url) {
      var parsed = parseUrl(url);
      if (!parsed) {
        return null;
      }

      var id, seq;

      if (parsed.path.substr(0, 8) === '/stream/') {
        id = parsed.path.substr(8);

        var pageNo = parsed.fragment.match(/page\/([^\/]+)/);
        if (pageNo && pageNo.length >= 2) {
          seq = pageNo[1];
        }
      }

      return makePropertiesObject(url, id, seq);
    }

    handle.id = 'internetarchive';
    handle.display = 'Internet Archive';

    /**
     * Constructs an object literal that represents the stored-properties
     * to associate with an InternetArchive digital copy.
     *
     * @param  {string} src The source URL from which the properties were parsed.
     * @param  {string} id  The identifier used to uniquely reference a
     *                      particular digial copy at the Internet Archive.
     * @param  {string} seq The sequence number that identifies the page to be
     *                      used as the initial page of this digital copy.
     * @return {object}     The object literal of properties to be associated
     *                      with this digital copy.
     */
    function makePropertiesObject(src, id, seq) {
      if (!id) {
        return null;
      }

      return {
        src: src,
        id: id,
        seq: seq
      };
    }

    return handle;
  }

  function HathiTrustRefHandler() {
    function handle(url) {
      var parsed = parseUrl(url);
      if (!parsed) {
        return null;
      }

      var id, seq;

      switch (parsed.hostname) {
        case 'babel.hathitrust.org':
          id = parsed.query.id;
          seq = parsed.query.seq;
          break;

        case 'hdl.handle.net':
          id = parsed.path.substr(parsed.path.lastIndexOf('/') + 1);

          if (!parsed.query.urlappend) {
            break;
          }

          var subquery = parseQueryString(parsed.query.urlappend);
          if (!subquery) {
            break;
          }
          seq = subquery.seq;
          break;
      }

      if (!id) {
        return null;
      }

      return {
        src: url,
        htid: id,
        seq: seq
      };
    }

    handle.id = 'hathitrust';
    handle.display = 'HathiTrust';

    return handle;
  }

  function GoogleBooksRefHandler() {
    function handle(url) {
      var parsed = parseUrl(url);
      if (!parsed) {
        return null;
      }

      switch (parsed.hostname) {
        case 'books.google.com':
          var id = parsed.query.id;
          var section = parsed.query.printsec;
          var page = parsed.query.pg;
          break;
      }

      if (!id) {
        return null;
      }

      return {
        src: url,
        id: id,
        section: section,
        page: page
      };
    }

    handle.id = 'googlebooks';
    handle.display = 'Google Books';

    return handle;
  }

  /**
   * Parses a URL string into its components
   *
   * @param  {string} url
   * @return {URL}
   */
  function parseUrl(url) {
    if (!url) {
      return null;
    }

    // eslint-disable-next-line angular/document-service
    var parser = document.createElement('a');
    parser.href = url;

    return {
      toString: function() {
        return url;
      },
      protocol: parser.protocol,
      host: parser.host,
      hostname: parser.hostname,
      port: parser.port,
      path: parser.pathname,
      query: parseQueryString(parser.search),
      fragment: parser.hash
    };
  }

  /**
   * Parses a query string into key/value pairs
   *
   * @param {string} query
   * @return {object.<string,any>}
   */
  function parseQueryString(query, sep) {
    if (!query || !angular.isString(query)) {
      return {};
    }

    // remove leading '?'
    if (query[0] === '?') {
      query = query.substr(1);
    }

    // attempt to auto-detect separator
    if (!sep) {
      // auto-detection "bitmask"
      // 0 = none detected -- prefer '&'
      // 1 = only ';' detected -- use it
      // 2 = only '&' detected -- use it
      // 3 = both detected -- prefer '&'
      var flags = (query.indexOf(';') >= 0 ? 1 : 0) + (query.indexOf('&') >= 0 ? 2 : 0);
      sep = flags === 1 ? ';' : '&';
    }

    var parsed = {};

    var kvpairs = query.split(sep);
    kvpairs.forEach(function (pair) {
      var ix = pair.indexOf('=');
      var key = pair;
      var value = null;

      if (!key) {
        return;
      }

      if (ix >= 0) {
        key = pair.substr(0, ix);
        value = pair.substr(ix + 1);
      }

      try {
        key = decodeURIComponent(key);
        value = decodeURIComponent(value);
      } catch (URIError) {
        return;
      }

      // TODO: handle key array/map notation

      if (parsed.hasOwnProperty(key)) {
        // convert repeated keys into an array
        if (angular.isArray(parsed[key])) {
          parsed[key].push(value);
        } else {
          parsed[key] = [parsed[key], value];
        }
      } else {
        parsed[key] = value;
      }
    });

    return parsed;
  }

})();
