(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .config(config);

  /** @ngInject */
  function config($logProvider, /* toastrConfig, */ $mdThemingProvider,
                  tasksRepoProvider,
                  worksRepoProvider,
                  peopleRepoProvider,
                  articlesRepoProvider,
                  relnRepoProvider,
                  categorizationServiceProvider,
                  seeAlsoRepoProvider,
                  trcSearchProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    var API_PREFIX = '/api/catalog';

    tasksRepoProvider.url = API_PREFIX + '/v1/tasks';
    worksRepoProvider.url = API_PREFIX + '/works';
    peopleRepoProvider.url = API_PREFIX + '/people';
    articlesRepoProvider.url = API_PREFIX + '/entries/articles';
    relnRepoProvider.url = API_PREFIX + '/relationships';
    categorizationServiceProvider.url = API_PREFIX + '/categorizations';
    seeAlsoRepoProvider.url = API_PREFIX + '/seealso';
    trcSearchProvider.url = API_PREFIX + '/search';

    $mdThemingProvider.definePalette('darkBrown', {
      '50': '#595c59',
      '100': '#4c4f4c',
      '200': '#404240',
      '300': '#333533',
      '400': '#272827',
      '500': '#1a1b1a',
      '600': '#0d0e0d',
      '700': '#010101',
      '800': '#000000',
      '900': '#000000',
      'A100': '#e0f0e0',
      'A200': '#565956',
      'A400': '#7e837e',
      'A700': '#000000',

      contrastDefaultColor: 'light',
      contrastDarkColors: ['A100']
    });

    $mdThemingProvider.definePalette('copper', {
      '50': '#d4b190',
      '100': '#cca47e',
      '200': '#c5976b',
      '300': '#be8a59',
      '400': '#b67e47',
      '500': '#a47140',
      '600': '#926439',
      '700': '#7f5832',
      '800': '#6d4b2b',
      '900': '#5b3e23',
      'A100': '#dcc3ab',
      'A200': '#a47140',
      'A400': '#48321c',
      'A700': '#272927',

      contrastDefaultColor: 'light',
      contrastDarkColors: ['50', '100', '200', 'A100']
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('darkBrown')
      .accentPalette('copper');
  }

})();
