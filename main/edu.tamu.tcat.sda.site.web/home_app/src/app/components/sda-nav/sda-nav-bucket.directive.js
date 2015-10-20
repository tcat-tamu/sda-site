(function () {
   'use strict';

   angular
      .module('sda.site')
      .directive('sdaNavBucket', sdaNavBucket);

   /** @ngInject */
   function sdaNavBucket() {
      var directive = {
         require: '^sdaNav',
         restrict: 'E',
         templateUrl: 'app/components/sda-nav/sda-nav-bucket.html',
         transclude: true,
         replace: true,
         link: linkFunc,
         scope: {
            title: '@'
         },
         bindToController: true,
         controller: BucketController,
         controllerAs: 'vm'
      };

      return directive;

      function linkFunc(scope, el, attr, buckets) {
         buckets.add(scope.vm);
      }

      /** @ngInject */
      function BucketController() {
         var vm = this;

         vm.active = false;
         vm.sections = [];
         vm.setActive = setActive;
         vm.add = addSection;

         function setActive(section) {
            vm.sections.forEach(function (s) {
               s.active = false;
            });

            section.active = true;
         }

         function addSection(section) {
            if (vm.sections.length === 0) {
               setActive(section);
            }

            vm.sections.push(section);
         }
      }
   }

})();
