define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var LandingLayoutView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'layout.html'),

      ui: {
         mainRegion: '> .main-region',
         footerToggle: '> footer > .toggle',
         footer: '> footer > .container'
      },

      regions: {
         main: '@ui.mainRegion'
      },

      events: {
         'click @ui.footerToggle': function (evt) {
            evt.preventDefault();
            this.toggleFooter();
         }
      },

      toggleFooter: function () {
         this.ui.footer.slideToggle(300);
      },

      showFooter: function () {
         this.ui.footer.slideDown(300);
      },

      hideFooter: function () {
         this.ui.footer.slideUp(300);
      }

   });

   return LandingLayoutView;

});
