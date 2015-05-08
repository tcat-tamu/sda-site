define(function(require) {

   var Marionette = require('marionette');

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
         return '<iframe class="full" src="' + ctx.src + '"></iframe>';
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
      }
   });

   return HathitrustBookReaderView;

});
