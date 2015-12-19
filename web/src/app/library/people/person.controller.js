(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryPersonController', LibraryPersonController);

   /** @ngInject */
   function LibraryPersonController($stateParams, personRepository, workRepository) {
      var vm = this;

      vm.person = null;
      vm.relatedWorks = [];

      activate();

      function activate() {
         vm.person = personRepository.get({ id: $stateParams.id });
         vm.relatedWorks = workRepository.query({ aid: $stateParams.id });
      }
   }

})();
