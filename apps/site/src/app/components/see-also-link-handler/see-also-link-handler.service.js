(function () {
  'use strict';

  angular
    .module('sdaSite')
    .factory('seeAlsoLinkHandler', SeeAlsoLinkHandlerFactory);

  // emulation of an enum
  var TypeId = {
    work: 'trc.entries.bibliographic',
    person: 'trc.entries.biographical',
    article: 'trc.entries.article'
  }

  /** @ngInject */
  function SeeAlsoLinkHandlerFactory($state, $mdToast) {
    openLink.types = TypeId;
    return openLink;

    function openLink(anchor) {
      if (anchor && anchor.type) {
        switch (anchor.type) {
          case TypeId.work:
            return $state.go('library.book', { id: anchor.id });
          case TypeId.person:
            return $state.go('library.person', { id: anchor.id });
          case TypeId.article:
            return $state.go('article', { id: anchor.id });
          default:
            break;
        }
      }

      $mdToast.showSimple('I don\'t know how to follow that link.');
    }
  }

})();
