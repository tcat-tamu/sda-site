define(function (require) {

   var Marionette = require('marionette');
   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var TrcArticlesPod = require('trc-entries-articles');

   var SearchApp = require('./apps/landing_search/landing_search_app');
   var LandingLayoutView = require('./views/landing_layout_view');


   function initialize(el, config) {
      var rootRegion = new Marionette.Region({
         el: el
      });

      var layout = new LandingLayoutView();
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

      channel.on('article:show', function (id) {
         window.location = config.articleReaderPrefix + id;
      });


      SearchApp.initialize({
         channel: channel,
         repo: articlesRepo,
         formRegion: layout.getRegion('left'),
         resultsRegion: layout.getRegion('main')
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
