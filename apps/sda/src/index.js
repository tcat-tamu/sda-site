var angular = require('angular');

var sitenavProviderService = require('./sda-sitenav/sda-sitenav.service');
var sitenavComponent = require('./sda-sitenav/sda-sitenav.component');
var headerComponent = require('./sda-header/sda-header.component');

angular
  .module('sda', [
    'ngMaterial'
  ])
  .provider('sdaSitenav', sitenavProviderService.SdaSitenavProvider)
  .component('sdaSitenav', sitenavComponent.component)
  .component('sdaHeader', headerComponent.component);
