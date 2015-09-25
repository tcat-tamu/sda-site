define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var TOC = require('toc_generator');

   var ArticleReaderView = Marionette.ItemView.extend({

      template: _.partial(nunjucks.render, 'article/content.html'),

      ui: {
         contentArea: '> article > .content'
      },

      getToc: function () {
         return TOC.generate(this.ui.contentArea);
      }

   });


   return ArticleReaderView;

});
