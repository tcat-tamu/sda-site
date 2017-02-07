(function () {
  'use strict';

  angular
    .module('sdaHome')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController(content) {
    var vm = this;
    vm.content = content;

    activate();

    function activate() {
      angular.element('main.fullpage-scroll').fullpage({
        scrollOverflow: true,
        sectionSelector: '.fullpage-scroll-section',
        slideSelector: '.fullpage-scroll-slide',
        paddingTop: '4rem' // HACK
      });
    }
  }

})();
