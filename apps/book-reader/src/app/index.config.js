(function () {
  'use strict';

  angular
    .module('sdaBookReader')
    .config(config);

  /** @ngInject */
  function config($logProvider, googleBooksApiProvider, toastrConfig, citeprocProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    googleBooksApiProvider.configure({
      preventLoad: true
    });

    angular.extend(toastrConfig, {
      positionClass: 'toast-bottom-right',
      progressBar: true,
      timeOut: 3000
    });

    var CSL_LOCALES = {
      'en-US': 'en-US'
    };

    var CSL_STYLES = {
      mla: 'modern-language-association',
      chicago: 'chicago-author-date'
    };

    // helpers

    angular.forEach(CSL_LOCALES, addLocale);
    angular.forEach(CSL_STYLES, addStyle);

    function addLocale(filename, localeId) {
      citeprocProvider.addLocale(localeId, supplier);

      /** @ngInject */
      function supplier($http) {
        return $http.get('assets/csl/locales/locales-' + filename + '.xml').then(function (res) {
          return res.data;
        });
      }
    }

    function addStyle(filename, styleId) {
      citeprocProvider.addStyle(styleId, supplier);

      /** @ngInject */
      function supplier($http) {
        return $http.get('assets/csl/styles/' + filename + '.csl').then(function (res) {
          return res.data;
        });
      }
    }
  }

})();
