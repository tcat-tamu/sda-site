/* global d3:false, moment:false, ConceptBrowser:true */
(function () {
  'use strict';

  angular
    .module('sda.concept-browser')
    .constant('d3', d3)
    .constant('moment', moment)
    .constant('ConceptBrowser', ConceptBrowser);

})();
