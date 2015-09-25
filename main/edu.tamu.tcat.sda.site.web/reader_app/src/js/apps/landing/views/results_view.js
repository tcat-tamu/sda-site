define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   function stripTags(str) {
      if (!_.isString(str)) {
         return null;
      }

      return str.replace(/<[^>]+>/g, '');
   }

   function truncate(str, numWords) {
      var words = str.split(' ');
      return words.length > numWords ? words.slice(0, numWords - 1).join(' ') + '...' : words.join(' ');
   }


   var ResultView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'search/article_result.html'),
      className: 'article-result',

      ui: {
         readMore: '> a.read-more'
      },

      triggers: {
         'click @ui.readMore': 'read:more'
      },

      templateHelpers: function () {
         return {
            excerpt: truncate(stripTags(this.model.get('content')), 40)
         };
      }
   });


   var ResultsView = Marionette.CollectionView.extend({
      childView: ResultView,
      className: 'article-results',

      childEvents: {
         'read:more': function (view, options) {
            this.trigger('read:more', options.model);
         }
      }
   });


   return ResultsView;

});
