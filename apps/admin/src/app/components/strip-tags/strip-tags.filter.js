(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .filter('stripTags', stripTagsFilter);

  function stripTagsFilter() {
    return stripTags;
  }

  function stripTags(html) {
    return html ? String(html).replace(/<[^>]+>/gm, '') : '';
  }

})();
