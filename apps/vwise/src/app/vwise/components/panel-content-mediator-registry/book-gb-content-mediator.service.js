(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .factory('googleBooksContentMediator', googleBooksContentMediatorFactory);

  /** @ngInject */
  function googleBooksContentMediatorFactory(vwise) {
    function Mediator() {
      vwise.PanelContentMediator.call(this, 'gb-reader', 'Google Books Digital Copy mediator');
    }

    Mediator.prototype = Object.create(vwise.PanelContentMediator.prototype);

    Mediator.prototype.matches = function matches(obj) {
      return obj.type && obj.type === 'googlebooks';
    };

    Mediator.prototype.getTemplate = function getTemplate() {
      return '<google-book-reader book-id="content.properties.id" page="content.properties.page" flex></google-book-reader>'
    };

    return new Mediator();
  }

})();
