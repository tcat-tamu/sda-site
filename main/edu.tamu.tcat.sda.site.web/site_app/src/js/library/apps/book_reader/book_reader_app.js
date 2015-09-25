define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var HathitrustBookReaderView = require('./views/hathitrust_book_reader_view');


   var BookReaderController = Marionette.Controller.extend({
      initialize: function(opts) {
         this.mergeOptions(opts, ['region']);
      },

      displayBookReader: function(copyId) {
         // HACK: parse HTID from copyId and display book reader
         var idParts = copyId.match(/^htid:(\d{9})#(.+)$/);
         if (!idParts) {
            throw new Error('expected HathiTrust resource identifier, received {' + copyId + '}');
         }

         var htid = idParts[2];
         var bookReaderView = new HathitrustBookReaderView({
            className: 'book',
            htid: htid
         });

         this.region.show(bookReaderView);
      }
   });


   var BookReaderRouter = Marionette.AppRouter.extend({
      appRoutes: {
         'read/:id': 'displayBookReader'
      }
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         var controller = new BookReaderController({
            region: opts.region
         });

         var router = new BookReaderRouter({
            controller: controller
         });

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         opts.channel.on('bookreader:show', function (copyId) {
            router.navigate('read/' + encodeURIComponent(copyId));
            controller.displayBookReader(copyId);
         });
      }
   };

});
