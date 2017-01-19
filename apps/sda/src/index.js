var angular = require('angular');

require('./style.scss');

var slide = require('./slide-toggle/slide.animation');
var sdaSitenavService = require('./sda-sitenav/sda-sitenav.service');
var sdaSitenavComponent = require('./sda-sitenav/sda-sitenav.component');
var sdaHeader = require('./sda-header/sda-header.component');
var seeAlso = require('./see-also/see-also.component');
var collapsibleSummaryComponent = require('./collapsible-summary/collapsible-summary.component');
var empty = require('./empty/empty.filter');
var stripTags = require('./strip-tags/strip-tags.filter');
var googleAnalytics = require('./google-analytics/google-analytics.service');
var workCitationComponent = require('./work-citation/work-citation.component');
var workTitleComponent = require('./work-title/work-title.component');
var workTitleFilter = require('./work-title/work-title.filter');

angular
  .module('sda', [
    'ngMaterial',
    'trcSeeAlso',
    'trcBiblio'
  ])
  .animation('.slide', slide.slideToggle)
  .provider('sdaSitenav', sdaSitenavService.SdaSitenavProvider)
  .provider('analytics', googleAnalytics.GoogleAnalyticsProvider)
  .component('sdaSitenav', sdaSitenavComponent.component)
  .component('sdaHeader', sdaHeader.component)
  .component('seeAlso', seeAlso)
  .component('workTitle', workTitleComponent.component)
  .component('workCitation', workCitationComponent.component)
  .component('collapsibleSummary', collapsibleSummaryComponent.component)
  .filter('empty', empty)
  .filter('stripTags', stripTags)
  .filter('workTitle', workTitleFilter.factory);
