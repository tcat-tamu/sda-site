(function () {
  'use strict';

  angular
    .module('vwise')
    .directive('vwisePanel', vwisePanel);

  /** @ngInject */
  function vwisePanel($compile) {
    var directive = {
      restrict: 'E',
      require: ['^^vwiseWorkspace', 'vwisePanel'],
      templateUrl: 'app/vwise/components/panel/panel.html',
      replace: true,
      scope: {
        panel: '='
      },
      link: linkFunc,
      controller: PanelController,
      controllerAs: 'vm'
    };

    return directive;

    function linkFunc($scope, $el, attr, controllers) {
      // var workspaceController = controllers[0];
      var panelController = controllers[1];

      // define overridable content areas on controller
      panelController.getInfoArea = function () {
        return $el.find('.panel-area-left');
      };

      panelController.getStatusArea = function () {
        return $el.find('.panel-area-bottom')
      };

      var panel = panelController.panel

      // shorthand for use in template
      $scope.vp = panel.vprops;

      var panelScope = $scope.$new(true);
      panelScope.content = panel.content;
      panelScope.vprops = panel.vprops;

      panelScope.$watch('vprops.background', function (color) {
        var rgb = hextorgb(color);
        panel.vprops.foreground = calculateForeground(rgb);
      });

      // NOTE: vprop updates are saved automatically when panel API is called.
      //       content updates need to be saved manually since they are modified in-place.
      panelScope.$watch('content', function () {
        panel.save();
      }, true);

      var template = panel.contentMediator.getTemplate();

      var contentArea = $el.find('.content');
      contentArea.html(template);
      $compile(contentArea.contents())(panelScope);
    }
  }

  /** @ngInject */
  function PanelController($scope) {
    var vm = this;

    vm.resizing = false;
    vm.actionButtons = [];
    vm.propertyButtons = [];
    vm.panel = $scope.panel;

    vm.addActionButton = addActionButton;
    vm.addPropertyButton = addPropertyButton;
    vm.closePanel = closePanel;
    vm.startResize = startResize;
    vm.resizePanel = resizePanel;
    vm.stopResize = stopResize;
    vm.movePanel = movePanel;
    vm.stopMove = stopMove;
    vm.activatePanel = activatePanel;

    function addActionButton(spec) {
      vm.actionButtons.push(spec);

      return function () {
        var ix = vm.actionButtons.indexOf(spec);
        if (ix >= 0) {
          vm.actionButtons.splice(ix, 1);
        }
      };
    }

    function addPropertyButton(spec) {
      vm.propertyButtons.push(spec);

      return function () {
        var ix = vm.propertyButtons.indexOf(spec);
        if (ix >= 0) {
          vm.propertyButtons.splice(ix, 1);
        }
      };
    }

    function closePanel() {
      vm.panel.remove();
    }

    function movePanel(evt, ui) {
      vm.panel.vprops.xPosition = ui.position.left;
      vm.panel.vprops.yPosition = Math.max(0, ui.position.top);
    }

    function stopMove(evt, ui) {
      // TODO: jQuery UI supports 'containment' option...
      var top = Math.max(0, ui.position.top);

      vm.panel.setPosition(ui.position.left, top);
      activatePanel();
    }

    function startResize() {
      vm.resizing = true;
    }

    function resizePanel(evt, ui) {
      var width = ui.position.left;
      var height = ui.position.top;

      $scope.$apply(function () {
        vm.panel.vprops.width = Math.max(0, width);
        vm.panel.vprops.height = Math.max(0, height);
      });
    }

    function stopResize(evt, ui) {
      vm.resizing = false;

      var width = ui.position.left;
      var height = ui.position.top;

      $scope.$apply(function () {
        vm.panel.setSize(Math.max(0, width), Math.max(0, height));
      });
    }

    function activatePanel(evt) {
      vm.panel.activate();

      if (evt && evt.stopPropagation) {
        evt.stopPropagation();
      }
    }
  }

  /**
   * Convert a CSS hex color string to rgb percentage values
   * @param  {string} hex
   * @return {Object.<string, float>}
   */
  function hextorgb(hex) {
    var match = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);

    if (!match) {
      return;
    }

    return {
      r: parseInt(match[1], 16) / 255,
      g: parseInt(match[2], 16) / 255,
      b: parseInt(match[3], 16) / 255
    };
  }

  /**
   * Calculate a good contrasting foreground color (black/white) given an rgb background color
   * @param {Object.<string, float>} r, g, and b color percentage points
   * @return {string} rgba foreground color spec
   */
  function calculateForeground(rgb) {
    // Foreground calculation from http://stackoverflow.com/a/3943023

    // calculate luminance coefficient
    // see https://en.wikipedia.org/wiki/Luma_(video)#Rec._601_luma_versus_Rec._709_luma_coefficients
    var r = (rgb.r <= 0.03928) ? rgb.r / 12.92 : Math.pow((rgb.r + 0.055) / 1.055, 2.4);
    var g = (rgb.g <= 0.03928) ? rgb.g / 12.92 : Math.pow((rgb.g + 0.055) / 1.055, 2.4);
    var b = (rgb.b <= 0.03928) ? rgb.b / 12.92 : Math.pow((rgb.b + 0.055) / 1.055, 2.4);

    var lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // set contrast color based on W3C recommendations
    // see https://www.w3.org/TR/WCAG20/

    // panel.vprops.foreground = (lum > 0.179) ? '#000000' : '#ffffff';
    // adjusted so that #808080 is the transition point between FG colors
    return (lum > 0.215) ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.87)';
  }

})();
