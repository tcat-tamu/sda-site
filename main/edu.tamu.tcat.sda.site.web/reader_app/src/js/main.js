define(function (require) {

   var Marionette = require('marionette');
   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var TrcArticlesPod = require('trc-entries-articles');

   var LayoutView = require('./views/layout_view');
   var LandingApp = require('./apps/landing/landing_app');
   var ArticleReaderApp = require('./apps/article_reader/article_reader_app');

   function initialize(el, config) {
      var rootRegion = new Marionette.Region({
         el: el
      });

      var layout = new LayoutView();
      rootRegion.show(layout);

      var TrcArticlesModule = TrcArticlesPod.factory();

      TrcArticlesModule.initialize({
         rest: {
            articles: config.apiEndpoint + '/articles'
         }
      });

      var articlesRepo = TrcArticlesModule.createArticlesRepository();


      var channel = Radio.channel('landing');

      channel.on('all', function () {
         console.log(arguments);
      });

      LandingApp.initialize({
         channel: channel,
         repo: articlesRepo,
         region: layout.getRegion('main')
      });

      ArticleReaderApp.initialize({
         channel: channel,
         repo: articlesRepo,
         region: layout.getRegion('main')
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
