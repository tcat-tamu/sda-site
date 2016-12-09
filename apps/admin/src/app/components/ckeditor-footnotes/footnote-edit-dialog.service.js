(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .factory('footnoteEditDialog', footnoteEditDialogFactory);

  /** @ngInject */
  function footnoteEditDialogFactory($mdBottomSheet) {
    return {
      show: showDialog
    };

    function showDialog($event, footnote, options) {
      var opts = angular.merge({}, options);

      var config = {
        templateUrl: 'app/components/ckeditor-footnotes/footnote-edit-dialog.html',
        controller: FootnoteEditDialogController,
        controllerAs: 'vm',
        clickOutsideToClose: false,
        locals: {
          footnote: footnote,
          references: opts.references,
          ckeditorConfig: opts.ckeditor
        }
      };

      return $mdBottomSheet.show(config);
    }
  }

  /** @ngInject */
  function FootnoteEditDialogController($mdBottomSheet, footnote, references, ckeditorConfig) {
    var vm = this;

    vm.footnote = footnote;
    vm.references = references;
    vm.ckeditorConfig = ckeditorConfig;

    vm.done = done;
    vm.cancel = cancel;

    function done() {
      $mdBottomSheet.hide();
    }

    function cancel() {
      $mdBottomSheet.cancel();
    }
  }

})();
