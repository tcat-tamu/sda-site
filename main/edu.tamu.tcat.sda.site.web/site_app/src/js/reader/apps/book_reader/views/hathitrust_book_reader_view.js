define(function(require) {

   var Marionette = require('marionette');
   var $ = require('jquery');

   /**
    * Formats a URL to embed a HathiTrust book reader
    *
    * @param  {string} id HathiTrust digital copy ID
    * @return {string}    Reader URL
    */
   function getHathitrustBookReaderUrl(id) {
      return '//babel.hathitrust.org/cgi/pt?id=' + id + ';ui=embed';
   }

   var HathitrustBookReaderView = Marionette.ItemView.extend({
      template: function(ctx) {
         // HACK: see if we can make this thing stretch to fill its parent container...
         return '<iframe width="100%" src="' + ctx.src + '"></iframe>';
      },

      id: 'bookreader',

      className: 'hathitrust-reader',

      templateHelpers: function() {
         return {
            src: getHathitrustBookReaderUrl(this.htid)
         };
      },

      ui: {
         iframe: '> iframe'
      },

      initialize: function(opts) {
         if (!opts.htid) {
            throw new TypeError('no htid given');
         }

         this.mergeOptions(opts, ['htid']);
      },

      onShow: function () {
         var _this = this;

         function resizePageBody() {
           var docHeight = $(window).height();
           // HACK: prevent overflow by subtracting 40 pixels from document height
           _this.ui.iframe.height(docHeight - _this.ui.iframe.offset().top - 40);
         }

         resizePageBody();
         $(window).on('resize.fill_window', resizePageBody);
      },

      onDestroy: function () {
         $(window).off('resize.fill_window');
         this.ui.iframe.height('auto');
      }
   });

   return HathitrustBookReaderView;

});
