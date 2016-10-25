(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('DataContainerController', DataContainerController);


  /** @ngInject */
  function DataContainerController() {
    var vm = this;
    var listeners = [];

    vm.watch = watch;
    vm.set = set;
    vm.value = null;

    /**
     * Attach a listener to watch for value changes
     * @param  {Function} fn listener callback
     * @return {Function} unregister function
     */
    function watch(fn) {
      listeners.push(fn);
      fn(vm.value);
      return unregister;

      function unregister() {
        var ix = listeners.indexOf(fn);
        if (ix >= 0) {
          listeners.splice(ix, 1);
        }
      }
    }

    /**
     * Updates internal value
     * @param {*} newValue
     */
    function set(newValue) {
      if (vm.value === newValue) {
        return;
      }

      vm.value = newValue;

      listeners.forEach(function (fn) {
        fn(newValue);
      });
    }
  }

})();
