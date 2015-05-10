define(function(require) {

   var Marionette = require('marionette');

   var FillWindow = require('layout_behavior/fill_window');

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
         return '<iframe class="full" height="600" src="' + ctx.src + '"></iframe>';
      },

      id: 'bookreader',

      className: 'hathitrust-reader full',

      templateHelpers: function() {
         return {
            src: getHathitrustBookReaderUrl(this.htid)
         };
      },

      initialize: function(opts) {
         if (!opts.htid) {
            throw new TypeError('no htid given');
         }

         this.mergeOptions(opts, ['htid']);
      },

      onShow: function () {
         // HACK stretch main DOM element to fit larger book reader
         FillWindow.initialize('main');
      },

      onDestroy: function () {
         FillWindow.dispose();
      }
   });

   return HathitrustBookReaderView;

});
