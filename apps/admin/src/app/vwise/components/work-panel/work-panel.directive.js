(function () {
  'use strict';

  angular
    .module('vwise')
    .directive('workPanel', workPanelDirective);

  /** @ngInject */
  function workPanelDirective(worksRepo) {
    var directive = {
      restrict: 'E',
      require: '^^vwisePanel',
      templateUrl: 'app/vwise/components/work-panel/work-panel.html',
      scope: {
        work: '=',
        relationships: '=',
        vprops: '='
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, el, attrs, panel) {
      panel.addActionButton(createExpandCollapseButton());

      scope.title = worksRepo.getTitle(scope.work.titles);

      scope.work.editions.forEach(function (edition) {
        edition.type = 'edition';
        edition.workId = scope.work.id;
      });

      /**
       * @return {object}
       */
      function createExpandCollapseButton() {
        var origSize = {
          width: scope.vprops.width,
          height: scope.vprops.height
        };

        var panelLabel = el.find('.panel-label');

        var button = {
          label: 'collapse',
          icon: 'expand_less',
          handler: toggleCollapse
        };

        return button;

        function toggleCollapse() {
          if (button.icon === 'expand_less') {
            origSize.width = scope.vprops.width;
            origSize.height = scope.vprops.height;
            scope.vprops.width = panelLabel.outerWidth() + 1;
            scope.vprops.height = panelLabel.outerHeight();
            button.label = 'expand';
            button.icon = 'expand_more';
          } else {
            scope.vprops.width = origSize.width;
            scope.vprops.height = origSize.height;
            button.label = 'collapse';
            button.icon = 'expand_less';
          }
        }
      }
    }

  }

})();
