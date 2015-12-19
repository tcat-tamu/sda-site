(function () {
   'use strict';

   angular
      .module('sda.library')
      .directive('sdaWorkTitle', sdaWorkTitle);

   /** @ngInject */
   function sdaWorkTitle() {
      var directive = {
         restrict: 'E',
         template: '{{title}}',
         scope: {
            titles: '=ngModel'
         },
         controller: SdaWorkTitleController
      };

      return directive;

      /** @ngInject */
      function SdaWorkTitleController($scope, _) {
         $scope.$watch('titles', function (titles) {
            $scope.title = titles ? getDisplayTitle(titles) : '';
         });

         /**
          * Get display title from a collection of titles
          *
          * @param {Title[]} titles
          * @return {string}
          */
         function getDisplayTitle(titles) {
            if (!titles) {
               return null;
            }

            var title;

            // try looking for 'short' title
            title = _.find(titles, function (title) {
               return title.type.toLowerCase() === 'short';
            });

            // next try looking for 'canonical' title
            title = title || _.find(titles, function (title) {
               return title.type.toLowerCase() === 'canonical';
            });

            // if all else fails, get any title
            title = title || _.find(titles, function (title) {
               return title.title;
            });

            return title
               ? title.title + (title.subtitle ? ': ' + title.subtitle : '')
               : null;
         }
      }
   }

})();
