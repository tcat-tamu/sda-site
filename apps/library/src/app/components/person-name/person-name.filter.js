(function () {
   'use strict';

   angular
      .module('sdaLibrary')
      .filter('personName', personName);

   /** @ngInject */
   function personName(_) {
      return renderName;

      function renderName(name) {
         var parts = name ? [
            name.title,
            name.givenName,
            name.middleName,
            name.familyName,
            name.suffix
         ] : [];

         return _.filter(parts).join(' ');
      }
   }

})();
