(function () {
   'use strict';

   angular
      .module('sda.library')
      .directive('sdaWorkCitation', sdaWorkCitation);

   /** @ngInject */
   function sdaWorkCitation(_) {
      var directive = {
         restrict: 'E',
         templateUrl: 'app/library/components/sda-work-citation/sda-work-citation.html',
         scope: {
            workId: '=',
            authors: '=',
            titles: '=',
            title: '=',
            edition: '=',
            volume: '=',
            publicationInfo: '='
         },
         link: linkFunc
      };

      return directive;

      function linkFunc(scope) {
         scope.$watch('titles', function (titles) {
            if (!scope.title && titles) {
               scope.title = getDisplayTitle(titles);
            }
         });
      }


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

})();
