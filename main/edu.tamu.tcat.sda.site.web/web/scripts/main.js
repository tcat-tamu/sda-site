define(function (require) {
   // require('./plugins');
   require('./legacy-main');

   var Biblio = require('trc-entries-biblio');
   var Backbone = require('backbone');
   var Marionette = require('marionette');
   var Marionette = require('marionette');
   var BookreaderView = require('modules/library/bookreader');

   var Router = Marionette.AppRouter.extend({
      appRoutes: {
         ":id": 'displayBiblioWork'
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
      }


   });

   var Layout = Marionette.LayoutView.extend({
      regions: {
         "bookreader": '#bookreader'
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
