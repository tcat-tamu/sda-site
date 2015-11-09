(function() {
   'use strict';

   angular
      .module('sda')
      .directive('bgImage', bgImage);

   /** @ngInject */
   function bgImage() {
      var directive = {
         restrict: 'A',
         link: linkFunc
      };

      return directive;

      function linkFunc(scope, el, attr) {
         var url = attr.bgImage;
         el.css('background-image', 'url(' + url + ')');
      }
   }

})();
