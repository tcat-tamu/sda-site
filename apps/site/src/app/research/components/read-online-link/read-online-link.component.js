(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .component('readOnlineLink', {
      templateUrl: 'app/research/components/read-online-link/read-online-link.html',
      bindings: {
        copies: '<',
        workId: '<',
        editionId: '<',
        volumeId: '<'
      },
      controller: ReadOnlineLinkController
    });

  function ReadOnlineLinkController() {
    var vm = this;

    vm.getUrl = getUrl;

    function getUrl(bookId) {
      var url = '/book-reader/#/' + vm.workId + '/' + bookId;

      if (vm.editionId || vm.volumeId) {
        url += '?';
      }

      if (vm.editionId) {
        url += 'editionId=' + vm.editionId;
      }

      if (vm.editionId && vm.volumeId) {
        url += '&';
      }

      if (vm.volumeId) {
        url += 'volumeId=' + vm.volumeId;
      }

      return url;
    }
  }

})();
