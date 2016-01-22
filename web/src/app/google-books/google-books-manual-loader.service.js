(function () {
   'use strict';

   angular
      .module('google.books')
      .service('googleBooksApiManualLoader', googleBooksApiManualLoader);

   /** @ngInject */
   function googleBooksApiManualLoader(googleBooksScriptLoader) {
      var API = {};

      API.load = load;

      return API;

      function load() {
         googleBooksScriptLoader.manualLoad();
      }
   }

})();
