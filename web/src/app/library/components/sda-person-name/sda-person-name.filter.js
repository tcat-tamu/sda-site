(function () {
   'use strict';

   angular
      .module('sda.library')
      .filter('sdaPersonName', sdaPersonName);

   /** @ngInject */
   function sdaPersonName(_) {
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
