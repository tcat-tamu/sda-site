/**
 * Inspired by https://github.com/angular-ui/angular-google-maps/blob/f7c17e4336344afe9c31ca8b8a1e200e268f4979/src/coffee/providers/map-loader.coffee
 */
(function () {
   'use strict';

   angular
      .module('sdaSite')
      .provider('googleBooksApi', googleBooksApiProvider);

   function googleBooksApiProvider() {
      var API = {};

      API.options = {
         transport: 'https',
         v: 0,
         language: 'en',
         preventLoad: false
      };

      API.configure = configure;
      API.$get = loadGoogleBooks;

      return API;

      function configure(options) {
         angular.extend(API.options, options);
      }

      /** @ngInject */
      function loadGoogleBooks(googleBooksScriptLoader) {
         return googleBooksScriptLoader.load(API.options);
      }
   }

})();
