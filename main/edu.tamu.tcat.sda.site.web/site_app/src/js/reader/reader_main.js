define(function (require) {

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');
   var TrcBiblioPod = require('trc-entries-biblio');
   var TrcRelnPod = require('trc-entries-reln');
   var TrcBioPod = require('trc-entries-bio');
   var TrcArticlesPod = require('trc-entries-articles');

   var ReaderLayoutView = require('./views/reader_layout_view');

   var BookSearchApp = require('./apps/book_search/book_search_app');
   var WorkInfoApp = require('./apps/work_info/work_info_app');
   var BookReaderApp = require('./apps/book_reader/book_reader_app');
   var AuthorInfoApp = require('./apps/author_info/author_info_app');
   var ArticleSearchApp = require('./apps/article_search/article_search_app');
   var ArticleReaderApp = require('./apps/article_reader/article_reader_app');


   function initialize(el, config) {

      var layout = new ReaderLayoutView({ el: el });
      layout.render();

      var TrcBiblioModule = TrcBiblioPod.factory();
      var TrcRelnModule = TrcRelnPod.factory();
      var TrcBioModule = TrcBioPod.factory();
      var TrcArticlesModule = TrcArticlesPod.factory();

      TrcBiblioModule.initialize({
         rest: {
            works: config.apiEndpoint + '/works',
            references: config.apiEndpoint + '/copies'
         }
      });

      TrcRelnModule.initialize({
         rest: {
            relationships: config.apiEndpoint + '/relationships'
         }
      });

      TrcBioModule.initialize({
         rest: {
            people: config.apiEndpoint + '/people'
         }
      });

      TrcArticlesModule.initialize({
         rest: {
            articles: config.apiEndpoint + '/articles'
         }
      });

      var workRepo = TrcBiblioModule.createWorksRepository();
      var copyRefRepo = TrcBiblioModule.createReferencesRepository();
      var relnRepo = TrcRelnModule.createRelationshipsRepository();
      var personRepo = TrcBioModule.createPeopleRepository();
      var articlesRepo = TrcArticlesModule.createArticlesRepository();

      var channel = Radio.channel('reader');

      channel.on('all', function () {
         console.log(arguments);
      });

      BookSearchApp.initialize({
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

      ArticleSearchApp.initialize({
         channel: channel,
         repo: articlesRepo,
         region: layout.getRegion('sidebar')
      });

      ArticleReaderApp.initialize({
         mainRegion: layout.getRegion('main'),
         navRegion: layout.getRegion('sidebar'),
         repo: articlesRepo,
         channel: channel
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
