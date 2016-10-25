(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('bibliography', bibliographyDirective);

  function bibliographyDirective(refsRenderer) {
    var directive = {
      restrict: 'E',
      scope: {
        collection: '='
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, el) {
      scope.$watch('collection', watcher, true);

      function watcher(obj) {
        if (!obj) {
          return;
        }

        refsRenderer.render('modern-language-association', scope.collection).then(function (rendered) {
          el.html(rendered.bibliography.html);
        });
      }
    }
  }

})();
