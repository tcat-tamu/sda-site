var angular = require('angular');

var sitenavProviderService = require('./sda-sitenav/sda-sitenav.service');
var sitenavComponent = require('./sda-sitenav/sda-sitenav.component');
var headerComponent = require('./sda-header/sda-header.component');
var seeAlsoComponent = require('./see-also/see-also.component');

angular
  .module('sda', [
    'ngMaterial',
    'trcSeeAlso'
  ])
  .provider('sdaSitenav', sitenavProviderService.SdaSitenavProvider)
  .component('sdaSitenav', sitenavComponent.component)
  .component('sdaHeader', headerComponent.component)
  .component('seeAlso', seeAlsoComponent);
