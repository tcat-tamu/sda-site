define(function (require) {

   var $ = require('jquery');

   var $pgBody;

   function initialize(pgBody) {
      $pgBody = $(pgBody);

      function resizePageBody() {
        var docHeight = $(window).height();
        $pgBody.height(docHeight - $pgBody.offset().top);
      }

      resizePageBody();
      $(window).on('resize.fill_window', resizePageBody);
   }

   function dispose() {
      $(window).off('resize.fill_window');
      $pgBody.height('auto');
   }


   return {
      initialize: initialize,
      dispose: dispose
   };

});
