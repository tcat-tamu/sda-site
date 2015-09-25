define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');
   var $ = require('jquery');

   var LandingLayoutView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'articles/layout.html'),

      ui: {
         leftRegion: '> main > aside.left',
         rightRegion: '> main > aside.right',
         mainRegion: '> main > article',
         footer: '> footer'
      },

      regions: {
         left: '@ui.leftRegion',
         right: '@ui.rightRegion',
         main: '@ui.mainRegion'
      },

      initialize: function () {
         this.originalPadding = null;
      },

      setFooterHeight: function () {
         if (this.originalPadding === null) {
            this.originalPadding = $('body').css('padding-bottom');
         }

         $('body').css('padding-bottom', this.ui.footer.height());
      },

      onAttach: function () {
         var setFooterHeight = _.debounce(_.bind(this.setFooterHeight, this), 200);
         this.$('footer img').on('load', setFooterHeight);
         $(window).on('resize.landing', setFooterHeight);
         setFooterHeight();
      },

      onDestroy: function () {
         $(window).off('.landing');

         if (this.originalPadding !== null) {
            $('body').css('padding-bottom', this.originalPadding);
         }
      }
   });

   return LandingLayoutView;

});
