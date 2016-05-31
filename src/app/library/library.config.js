(function () {
   'use strict';

   angular
      .module('sda.library')
      .config(config);

   /** @ngInject */
   function config(googleBooksApiProvider) {
      googleBooksApiProvider.configure({
         preventLoad: true
      });
   }

})();
