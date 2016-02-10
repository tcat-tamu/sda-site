(function () {
   'use strict';

   angular
      .module('sda.home')
      .directive('sdaBillboard', sdaBillboard);

   /** @ngInject */
   function sdaBillboard() {
      var directive = {
         restrict: 'E',
         templateUrl: 'app/home/components/sda-billboard/sda-billboard.html',
         transclude: true,
         replace: true,
         scope: {
            slides: '='
         },
         controller: BillboardController,
         bindToController: true,
         controllerAs: 'vm'
      };

      return directive;

      /** @ngInject */
      function BillboardController() {
         var vm = this;

         vm.setActive = setActive;
         vm.nextSlide = nextSlide;
         vm.prevSlide = prevSlide;

         activate();

         function activate() {
            if (vm.slides.length > 0) {
               setActive(vm.slides[0]);
            }
         }

         function setActive(slide) {
            vm.slides.forEach(function (s) {
               s.active = false;
            });

            slide.active = true;
         }

         function nextSlide() {
            var currentIndex = vm.slides.findIndex(function (slide) {
               return slide.active;
            });

            var nextIndex = (currentIndex + 1) % vm.slides.length;
            setActive(vm.slides[nextIndex]);
         }

         function prevSlide() {
            var currentIndex = vm.slides.findIndex(function (slide) {
               return slide.active;
            });

            var prevIndex = (currentIndex + vm.slides.length - 1) % vm.slides.length;
            setActive(vm.slides[prevIndex]);
         }
      }
   }

}());
