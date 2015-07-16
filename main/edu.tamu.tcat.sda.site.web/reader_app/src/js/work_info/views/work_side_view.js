define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var AuthorsView = require('./authors_view');


   var RelationshipView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'biblio/side/reln.html'),
      tagName: 'li',
      className: 'relationship',

      regions: {
         authors: '> .authors'
      },

      templateHelpers: function () {
         var target = this.model.get('target');
         var title = target.getCanonicalTitle();
         var pubInfo = target.has('publicationInfo') ? target.get('publicationInfo') : null;

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
            var entry = this.model.get('target');
            if (entry) {
               this.channel.trigger('work:show', entry.id);
            }
         }
      },

      initialize: function (options) {
         this.mergeOptions(options, ['channel']);
      },

      onShow: function () {
         var entry = this.model.get('target');
         if (entry && entry.has('authors')) {
            var authorsView = new AuthorsView({
               collection: entry.get('authors'),
               channel: this.channel
            });

            this.getRegion('authors').show(authorsView);
         }
      }
   });


   var RelationshipsView = Marionette.CollectionView.extend({
      tagName: 'ol',
      className: 'relationships',
      childView: RelationshipView,

      childViewOptions: function () {
         return {
            channel: this.channel
         };
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         this.mergeOptions(opts, ['channel']);
      }
   });

   var EditionView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'biblio/side/edition.html'),
      tagName: 'li',

      templateHelpers: function () {
         var title = this.model.getCanonicalTitle();
         var pubInfo = this.model.get('publicationInfo');

         return {
            title: title ? title.getFullTitle() : 'Unknown Title',
            pubDate: pubInfo.get('date').toJSON(),
            pubPlace: pubInfo.get('place'),
            publisher: pubInfo.get('publisher')
         };
      },

      regions: {
         authors: '> .authors'
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         this.mergeOptions(opts, ['channel']);
      },

      onShow: function () {
         var authorsView = new AuthorsView({
            collection: this.model.get('authors'),
            channel: this.channel
         });

         this.getRegion('authors').show(authorsView);
      }
   });


   var EditionsView = Marionette.CollectionView.extend({
      tagName: 'ol',
      className: 'editions',
      childView: EditionView,

      childViewOptions: function () {
         return {
            channel: this.channel
         };
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         this.mergeOptions(opts, ['channel']);
      }
   });


   var WorkSideView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'biblio/side/work.html'),
      className: 'work',

      templateHelpers: function () {
         var title = this.model.getCanonicalTitle();

         return {
            title: title ? title.getFullTitle() : 'Unknown Title',
            copyRef: this.copyRef,
            relationships: this.relationships
         };
      },

      regions: {
         authors: '> .authors'
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['channel', 'copyRefs', 'relationships']);

         this.copyRef = this.copyRefs.findWhere({
            associatedEntry: this.model.getUri()
         });
      },

      onShow: function () {
         var authorsView = new AuthorsView({
            collection: this.model.get('authors'),
            channel: this.channel
         });

         this.getRegion('authors').show(authorsView);

         if (this.model.has('editions') && !this.model.get('editions').isEmpty()) {
            var editionsView = new EditionsView({
               collection: this.model.get('editions'),
               copyRefs: this.copyRefs,
               channel: this.channel
            });

            this.addRegion('editions', '> .editions > div');
            this.getRegion('editions').show(editionsView);
         }

         if (!this.relationships.isEmpty()) {
            var relationshipsView = new RelationshipsView({
               collection: this.relationships,
               channel: this.channel
            });

            this.addRegion('relationships', '> .relationships > div');
            this.getRegion('relationships').show(relationshipsView);
         }
      }
   });


   return WorkSideView;

});
