(function() {
  'use strict';

  describe('controllers', function(){

    beforeEach(module('sda.site'));

    it('should have some tests', inject(function($controller) {
      var vm = $controller('MainController');

      var hasTests = false;
      expect(hasTests).toBeTruthy();
    }));
  });

})();
