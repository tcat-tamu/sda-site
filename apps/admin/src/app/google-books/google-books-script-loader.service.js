/**
 * Inspired by https://github.com/angular-ui/angular-google-maps/blob/f7c17e4336344afe9c31ca8b8a1e200e268f4979/src/coffee/providers/map-loader.coffee
 */
(function () {
   'use strict';

   angular
      .module('google.books')
      .factory('googleBooksScriptLoader', googleBooksScriptLoader);

   /** @ngInject */
   function googleBooksScriptLoader($window, $document, $q, _) {
      var scriptId = undefined;
      var usedConfiguration = undefined;

      return {
         load: load,
         manualLoad: manualLoad
      };

      /**
       * Get script URL for loading Google Books API
       *
       * @param {object} options
       * @return {string}
       */
      function getScriptUrl(options) {
         if (options.transport === 'auto') {
            return '//www.google.com/books/api.js?';
         } else {
            return options.transport + '://www.google.com/books/api.js?';
         }
      }

      function includeScript(options) {
         var omitOptions = ['transport', 'preventLoad', 'randomizedFunctionName'];

         var query = _.map(_.omit(options, omitOptions), function (v, k) { return k + '=' + v });

         if (scriptId) {
            var scriptElem = $document.getElementById(scriptId)
            scriptElem.parentNode.removeChild(scriptElem);
         } else {
            scriptId = 'gbooks_load_' + Math.round(Math.random() * 1000);
         }

         query = query.join('&');
         angular.element('<script>', {
            id: scriptId,
            type: 'text/javascript',
            src: getScriptUrl(options) + query
         }).appendTo(angular.element('body'));
      }

      function isGoogleBooksLoaded() {
         return angular.isDefined($window.google) && angular.isDefined($window.google.books);
      }

      function load(options) {
         var deferred = $q.defer();

         if (isGoogleBooksLoaded()) {
            deferred.resolve($window.google.books);
            return deferred.promise;
         }

         var randomizedFunctionName = 'onGoogleBooksReady' + Math.round(Math.random() * 1000);
         options.callback = randomizedFunctionName;

         $window[randomizedFunctionName] = function () {
            $window[randomizedFunctionName] = null;
            deferred.resolve($window.google.books);
         }

         if (!options.preventLoad) {
            includeScript(options);
         }

         usedConfiguration = options;
         usedConfiguration.randomizedFunctionName = randomizedFunctionName;

         return deferred.promise;
      }

      function manualLoad() {
         var config = usedConfiguration;

         if (!isGoogleBooksLoaded()) {
            includeScript(config);
         } else if ($window[config.randomizedFunctionName]) {
            $window[config.randomizedFunctionName]();
         }
      }
   }

})();
