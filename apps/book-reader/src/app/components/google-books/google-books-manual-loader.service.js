/**
 * Inspired by https://github.com/angular-ui/angular-google-maps/blob/f7c17e4336344afe9c31ca8b8a1e200e268f4979/src/coffee/providers/map-loader.coffee
 */
(function () {
   'use strict';

   angular
      .module('sdaBookReader')
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
