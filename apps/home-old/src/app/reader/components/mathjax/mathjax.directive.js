(function () {
   'use strict';

   angular
      .module('sda.reader')
      .directive('mathjax', mathjax);

   /** @ngInject */
   function mathjax(MathJax) {
      var directive = {
         restrict: 'EA',
         link: linkFunc
      };

      return directive;

      function linkFunc(scope, el, attr) {
         // update display when model changes
         scope.$watch(attr.ngModel, function (value) {
            el.html(value || '');
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, el.get(0)]);
         });
      }
   }

})();
