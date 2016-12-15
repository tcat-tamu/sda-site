(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .provider('sdaToast', SdaToastProvider);

  // TODO: this service appears to accomplish the same goal as $mdToast.addPreset
  //       perhaps this service should be replaced with custom $mdToast presets

  function SdaToastProvider() {
    var provider = {};

    provider.defaultOptions = {
      position: 'bottom right',
      hideDelay: 3000
    };

    provider.$get = SdaToastFactory

    return provider;

    /** @ngInject */
    function SdaToastFactory($mdToast) {
      var sdaToast = {
        success: showSuccessToast,
        info: showInfoToast,
        error: showErrorToast
      }

      return sdaToast;

      function showSuccessToast(message, options) {
        var opts = angular.merge({}, options, {
          toastClass: 'sda-toast-success' + (options && options.toastClass ? ' ' + options.toastClass : '')
        });

        return $mdToast.show(makeToast(message, opts));
      }

      function showInfoToast(message, options) {
        var opts = angular.merge({}, options, {
          toastClass: 'sda-toast-info' + (options && options.toastClass ? ' ' + options.toastClass : '')
        });

        return $mdToast.show(makeToast(message, opts));
      }

      function showErrorToast(message, options) {
        var opts = angular.merge({}, options, {
          toastClass: 'sda-toast-error' + (options && options.toastClass ? ' ' + options.toastClass : ''),
          hideDelay: false
        });

        return $mdToast.show(makeToast(message, opts));
      }

      function makeToast(message, options) {
        var opts = angular.merge({}, provider.defaultOptions, options);

        var toast = $mdToast.simple()
          .textContent(message)
          .toastClass(opts.toastClass)
          .position(opts.position)
          .hideDelay(opts.hideDelay);

        if (!opts.hideDelay || opts.action) {
          toast.action(opts.action || 'Dismiss')
        }

        return toast;
      }
    }
  }

})();
