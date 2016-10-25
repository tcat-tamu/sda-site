(function() {
  'use strict';

  describe('controllers', function(){
    var vm;

    beforeEach(module('sdaAdmin'));
    beforeEach(inject(function(_$controller_) {
      vm = _$controller_('MainController');
    }));

    it('should say hello', function() {
      expect(vm.name).toEqual(jasmine.any(String));
    });
  });
})();
