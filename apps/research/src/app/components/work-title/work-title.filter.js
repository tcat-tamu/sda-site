(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .filter('workTitle', workTitleFilterFactory);

  function workTitleFilterFactory(_) {
    return workTitleFilter;

    function workTitleFilter(title) {
      if (angular.isArray(title)) {
        title = title[0];
      }

      if (!title) {
        return '';
      }


      return _.compact([title.title, title.subtitle]).join(': ');
    }
  }

})();
