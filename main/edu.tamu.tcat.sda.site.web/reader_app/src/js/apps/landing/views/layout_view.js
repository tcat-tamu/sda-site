define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var LandingLayoutView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'landing.html'),

      ui: {
         leftRegion: '> main > aside.left',
         rightRegion: '> main > aside.right',
         mainRegion: '> main > article',
         footerToggle: '> footer > .toggle',
         footer: '> footer > .container'
      },

      regions: {
         left: '@ui.leftRegion',
         right: '@ui.rightRegion',
         main: '@ui.mainRegion'
      },

      events: {
         'click @ui.footerToggle': function (evt) {
            evt.preventDefault();
            this.ui.footer.slideToggle(300);
         }
      },

      initialize: function () {
         this.originalPadding = null;
      }

   });

   return LandingLayoutView;

});
