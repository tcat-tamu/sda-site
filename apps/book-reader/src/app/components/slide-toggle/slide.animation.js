/* global jQuery: true */
(function () {
  'use strict';

  angular
    .module('sdaBookReader')
    .animation('.slide', slideToggle);

  // easing fn from http://gsgd.co.uk/sandbox/jquery/easing/
  jQuery.easing.easeInOutCubic = function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  };

  function slideToggle() {
    var NG_HIDE_CLASS = 'ng-hide';

    return {
      beforeAddClass: beforeAddClass,
      removeClass: removeClass
    };

    function beforeAddClass(element, className, done) {
      if (className === NG_HIDE_CLASS) {
        element.slideUp(250, 'easeInOutCubic', done);
      }
    }

    function removeClass(element, className, done) {
      if (className === NG_HIDE_CLASS) {
        element.hide().slideDown(250, 'easeInOutCubic', done);
      }
    }
  }

})();
