define(function (require) {

   var $ = require('jquery');


   function initialize(pgBody) {
      var $pgBody = $(pgBody);

      function resizePageBody() {
        var docHeight = $(window).height();
        $pgBody.height(docHeight - $pgBody.offset().top);
      }

      resizePageBody();
      $(window).on('resize', resizePageBody);
   }


   return initialize;

});
