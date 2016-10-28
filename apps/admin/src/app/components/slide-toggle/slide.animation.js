(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .animation('.slide', slideToggle);

  function slideToggle() {
    var NG_HIDE_CLASS = 'ng-hide';

    return {
      beforeAddClass: beforeAddClass,
      removeClass: removeClass
    };

    function beforeAddClass(element, className, done) {
      if (className === NG_HIDE_CLASS) {
        element.slideUp(done);
      }
    }

    function removeClass(element, className, done) {
      if (className === NG_HIDE_CLASS) {
        element.hide().slideDown(done);
      }
    }
  }

})();
