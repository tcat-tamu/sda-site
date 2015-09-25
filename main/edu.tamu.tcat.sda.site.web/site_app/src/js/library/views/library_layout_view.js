define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var LibraryLayoutView = Marionette.LayoutView.extend({

      template: _.partial(nunjucks.render, 'reader.html'),

      ui: {
         sidebar: '> main > aside',
         main: '> main > article',
         footerToggle: '> footer > .toggle',
         footer: '> footer > .container'
      },

      events: {
         'click @ui.footerToggle': function (evt) {
            evt.preventDefault();
            this.ui.footer.slideToggle(300);
         }
      },

      regions: {
         sidebar: '@ui.sidebar',
         main: '@ui.main'
      }

   });

   return LibraryLayoutView;

});
