define(function (require) {

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');
   var WorkRepository = require('trc-entries-biblio');
   var RelationshipRepository = require('trc-entries-reln');
   var PersonRepository = require('trc-entries-bio');

   var LayoutView = require('./views/layout_view');

   var SearchApp = require('./search/search_app');
   var WorkInfoApp = require('./work_info/work_info_app');
   var BookReaderApp = require('./book_reader/book_reader_app');
   var AuthorInfoApp = require('./author_info/author_info_app');


   function initialize(el, config) {

      var layout = new LayoutView({ el: el });
      layout.render();

      var workRepo = new WorkRepository({
         apiEndpoint: config.apiEndpoint + '/works'
      });

      var copyRefRepo = new WorkRepository.CopyReferences({
         apiEndpoint: config.apiEndpoint + '/copies'
      });

      var relnRepo = new RelationshipRepository({
          apiEndpoint: config.apiEndpoint + '/relationships'
      });

      var personRepo = new PersonRepository({
         apiEndpoint: config.apiEndpoint + '/people'
      });

      var channel = Radio.channel('reader');

      channel.on('all', function () {
         console.log(arguments);
      });

      SearchApp.initialize({
         channel: channel,
         repo: workRepo,
         region: layout.getRegion('sidebar')
      });

      WorkInfoApp.initialize({
         mainRegion: layout.getRegion('main'),
         sideRegion: layout.getRegion('sidebar'),
         workRepo: workRepo,
         copyRefRepo: copyRefRepo,
         relnRepo: relnRepo,
         channel: channel
      });

      BookReaderApp.initialize({
         region: layout.getRegion('main'),
         channel: channel
      });

      AuthorInfoApp.initialize({
         region: layout.getRegion('main'),
         repo: personRepo,
         workRepo: workRepo,
         channel: channel
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
