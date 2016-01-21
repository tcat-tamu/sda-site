(function () {
   'use strict';

   angular
      .module('sda', [
         'sda.home',
         'sda.library',
         'sda.media',
         'sda.reader',
         'sda.conference',
         'ngAnimate',
         'ngCookies',
         'ngTouch',
         'ngSanitize',
         'ngResource',
         'ui.router',
         'rt.debounce'
      ]);

})();
