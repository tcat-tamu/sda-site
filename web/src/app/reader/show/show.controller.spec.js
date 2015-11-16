(function() {
  'use strict';

  describe('controllers', function(){

    beforeEach(module('sda.reader'));

    it('should have some tests', inject(function($controller) {
      var vm = $controller('ArticleShowController');

      var hasTests = false;
      expect(hasTests).toBeTruthy();
    }));
  });

})();
