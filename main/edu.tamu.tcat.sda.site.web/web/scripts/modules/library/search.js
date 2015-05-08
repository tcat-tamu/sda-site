define(function(require) {

   // Main AppModule for the search page. May be refactored to support
   // more modular searching

   var Marionette = require('marionette');
   var Widgets = require('trc-ui-widgets');
   var WorkRepository = require('trc-entries-biblio');

   var Backbone = require('backbone');
   var BookreaderView = require('modules/library/bookreader');

   var repo = new WorkRepository({
      apiEndpoint: "https://neal.citd.tamu.edu/sda/api/catalog"
   });

   var searchForm = new Widgets.Controls.SearchForm({
      searchProvider: function(q, limit) {
         // router.navigate('search?q=' + q);

         return WorkRepository.search(q, {
            limit: limit
         })
         .map(function(workSearchProxy) {
            // { title: ..., description: ..., obj: ... } object to be consumed by Autocomplete control
            return {
               title: workSearchProxy.label,
               description: null,
               obj: workSearchProxy
            };
         });
      }
   });

   searchForm.on('result:click', function(person) {
      alert('Clicked on ' + person.get('name'));
   });

   region.show(searchForm.getView());


   var Router = Marionette.AppRouter.extend({
      appRoutes: {
         // ":id": 'displayBiblioWork'
      }
   });

   var Controller = Marionette.Controller.extend({

      initialize: function(opts) {
         this.mergeOptions(opts, ['region']);
      },

      displayBiblioWork: function(id) {
         this.region.show(new BookreaderView({
            htid: id
         }));
      },

      searchForWork: function()
      {

      }


   });

   var Layout = Marionette.LayoutView.extend({
      regions: {
         "bookreader": '#bookreader',
         "basicBiblioSearch": '#biblio-search-basic'
      }
   });

   var layout = new Layout({
      el: '#page_body'
   });



   var router = new Router({
      controller: new Controller({
         region: layout.getRegion('bookreader')
      })
   });

   Backbone.history.start();


});
