var angular = require('angular');

require('./style.scss');

var slide = require('./slide-toggle/slide.animation');
var sdaSitenavService = require('./sda-sitenav/sda-sitenav.service');
var sdaSitenavComponent = require('./sda-sitenav/sda-sitenav.component');
var sdaHeader = require('./sda-header/sda-header.component');
var seeAlso = require('./see-also/see-also.component');
var empty = require('./empty/empty.filter');
var stripTags = require('./strip-tags/strip-tags.filter');
var googleAnalytics = require('./google-analytics/google-analytics.service');

angular
  .module('sda', [
    'ngMaterial',
    'trcSeeAlso'
  ])
  .animation('.slide', slide.slideToggle)
  .provider('sdaSitenav', sdaSitenavService.SdaSitenavProvider)
  .provider('analytics', googleAnalytics.GoogleAnalyticsProvider)
  .component('sdaSitenav', sdaSitenavComponent.component)
  .component('sdaHeader', sdaHeader.component)
  .component('seeAlso', seeAlso)
  .filter('empty', empty)
  .filter('stripTags', stripTags);
