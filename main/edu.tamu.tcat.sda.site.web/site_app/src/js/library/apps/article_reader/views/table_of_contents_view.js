define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');
   var $ = require('jquery');

   var TOC = require('toc_generator');


   var TableOfContentsView = Marionette.ItemView.extend({

      template: _.partial(nunjucks.render, 'library/article/toc.html'),

      id: function () {
         return this.cid;
      },

      ui: {
         tocArea: '> .toc'
      },

      events: {
         'click a': function (evt) {
            evt.preventDefault();
            var targetSelector = $(evt.target).attr('href');
            var $target = $(targetSelector);
            if ($target.length) {
               $('html,body').animate({
                  scrollTop: $target.offset().top
               }, 'slow');
            }
         },

         'affixed.bs.affix': function () {
            this.$el.css({
               'margin-top': -this.$el.position().top,
               'width': this.$el.parent().width()
            });
         },

         'affixed-top.bs.affix': function () {
            this.$el.css({
               'margin-top': 0,
               'width': 'auto'
            });
         },

         'affixed-bottom.bs.affix': function () {
            // TODO: set positioning when element hits bottom of page
         }
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.toc) {
            throw new TypeError('no table of contents provided');
         }

         this.mergeOptions(opts, ['toc']);
      },

      onShow: function () {
         this.$el.affix({
            offset: {
               top: this.$el.offset().top
            }
         });

         var tocDom = TOC.render(this.toc);
         $(tocDom).addClass('nav');
         this.ui.tocArea.append(tocDom);

         $('body').scrollspy({
            target: '#' + this.cid + ' > .toc'
         });
      }

   });

   return TableOfContentsView;

});
