(function() {
  'use strict';

  angular
    .module('sdaBookReader')
    .controller('BookReaderController', BookReaderController);

  /** @ngInject */
  function BookReaderController($stateParams, worksRepo) {
    var workId = $stateParams.workId;
    var editionId = $stateParams.editionId;
    var volumeId = $stateParams.volumeId;
    var copyId = $stateParams.copyId;

    var vm = this;

    activate();

    function activate() {
      vm.copyRef = worksRepo.getDigitalCopy(workId, editionId, volumeId, copyId);
    }

  }
})();
