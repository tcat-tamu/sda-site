(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .factory('noteContentMediator', noteContentMediatorFactory);

  /** @ngInject */
  function noteContentMediatorFactory(vwise) {
    function Mediator() {
      vwise.PanelContentMediator.call(this, 'notes', 'Note Content Mediator');
    }

    Mediator.prototype = Object.create(vwise.PanelContentMediator.prototype);

    Mediator.prototype.matches = function matches(obj) {
      return obj.hasOwnProperty('note');
    };

    Mediator.prototype.getTemplate = function getTemplate() {
      return '<div ng-model="content.note" contenteditable flex></div>'
    };

    return new Mediator();
  }

})();
