define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var AuthorsView = require('apps/work_info/views/authors_view');


   var RelatedWorkView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'biblio/side/related_work.html'),
      tagName: 'li',

      regions: {
         authors: '> .authors'
      },

      templateHelpers: function () {
         var title = this.model.getCanonicalTitle();
         var pubInfo = this.model.has('publicationInfo') ? this.model.get('publicationInfo') : null;

         return {
            title: title ? title.getFullTitle() : 'Unknown Title',
            pubDate: pubInfo ? pubInfo.get('date').toJSON() : null,
            publisher: pubInfo ? pubInfo.get('publisher') : null,
            pubPlace: pubInfo ? pubInfo.get('place') : null
         };
      },

      events: {
         'click .titleinfo': function (e) {
            e.preventDefault();
            this.channel.trigger('work:show', this.model.id);
         }
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['channel']);
      },

      onShow: function () {
         if (this.model.has('authors')) {
            var authorsView = new AuthorsView({
               collection: this.model.get('authors'),
               channel: this.channel
            });

            this.getRegion('authors').show(authorsView);
         }
      }
   });


   var RelatedWorksView = Marionette.CollectionView.extend({
      tagName: 'ul',
      className: 'related-works',
      childView: RelatedWorkView,

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['channel']);
      },

      childViewOptions: function () {
         return {
            channel: this.channel
         };
      }
   });


   return RelatedWorksView;

});
