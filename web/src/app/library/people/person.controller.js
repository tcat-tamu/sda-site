(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryPersonController', LibraryPersonController);

   /** @ngInject */
   function LibraryPersonController($stateParams, $scope, personRepository, workRepository) {
      var vm = this;

      vm.person = null;
      vm.relatedWorks = [];

      activate();

      function activate() {
         var id = $stateParams.id;

         $scope.$emit('set:query:people', null);

         if (id) {
            vm.person = personRepository.get({ id: id });
            vm.relatedWorks = workRepository.query({ aid: id });
         }
      }
   }

})();
