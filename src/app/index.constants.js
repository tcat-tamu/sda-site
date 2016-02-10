/* global _:false config:false CSL:false, moment:false */
(function () {
   'use strict';

   angular
      .module('sda')
      .constant('config', config)
      .constant('_', _)
      .constant('CSL', CSL)
      .constant('moment', moment);

})();
