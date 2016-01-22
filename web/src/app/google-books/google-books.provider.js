(function () {
   'use strict';

   angular
      .module('google.books')
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
