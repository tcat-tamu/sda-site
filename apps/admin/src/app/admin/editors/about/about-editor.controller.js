(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('AboutEditorController', AboutEditorController);

  var CKEDITOR_CONFIG = {

    toolbar: [
      { name: 'styles', items: [ 'Styles', 'Format' ] },
      { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
      { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
      { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
      { name: 'insert', items: [ 'Citation', 'Footnote', '-', 'Image', 'Table', 'HorizontalRule', 'SpecialChar', 'Mathjax' ] },
      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
      { name: 'editing', items: [ 'Scayt' ] },
      { name: 'tools', items: [ 'Maximize' ] },
      { name: 'document', items: [ 'Source' ] }
    ],

    // See http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-format_tags
    format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;address'
  };

  /** @ngInject */
  function AboutEditorController($q, $log, $stateParams, $scope, sdaToast, articlesRepo) {
    var vm = this;

    vm.save = save;

    vm.editor = {
      config: angular.extend({}, CKEDITOR_CONFIG, {
        removeButtons: 'Styles,Subscript,Superscript,Cut,Copy,Source'
      })
    };

    activate();

    // PUBLIC METHODS

    function save() {
      var savePromise = articlesRepo.save(vm.article);

      savePromise.then(function () {
        sdaToast.success('Saved');
      }, function () {
        sdaToast.error('Unable to save page.');
      });

      return savePromise;
    }

    // PRIVATE METHODS

    function activate() {
      vm.article = articlesRepo.get($stateParams.id);

      vm.article.$promise.catch(function () {
        return sdaToast.error('Failed to load data from the server');
      });
    }
  }

})();
