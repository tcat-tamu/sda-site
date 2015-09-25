define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var AuthorsView = require('./authors_view');


   var REGEX_STRIP_TAGS = /(<([^>]+)>)/ig;

   var env = nunjucks.configure();

   env.addFilter('striptags', function (str) {
      return str.replace(REGEX_STRIP_TAGS, '');
   });


   var PublicationInfoView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'reader/biblio/main/publication_info.html'),
      tagName: 'span'
   });


   var VolumeView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'reader/biblio/main/volume.html'),
      tagName: 'section',
      className: 'volume',

      regions: {
         authors: '> .citation > .authors',
         pubInfo: '> .citation > .pubinfo'
      },

      templateHelpers: function () {
         var title = this.model.getCanonicalTitle();
         return {
            title: title ? title.getFullTitle() : 'Unknown Title',
            copyRef: this.copyRef
         };
      },

      events: {
         'click .volume-copy.readonline': function () {
            var copyId = this.copyRef.get('copyId');
            this.channel.trigger('bookreader:show', copyId);
         }
      },

      initialize: function (options) {
         this.mergeOptions(options, ['channel', 'copyRefs']);

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


         var pubInfoView = new PublicationInfoView({
            model: this.model.get('publicationInfo')
         });

         this.getRegion('pubInfo').show(pubInfoView);
      }
   });


   var VolumesView = Marionette.CollectionView.extend({
      childView: VolumeView,

      childViewOptions: function () {
         return {
            channel: this.channel,
            copyRefs: this.copyRefs
         };
      },

      initialize: function (options) {
         this.mergeOptions(options, ['channel', 'copyRefs']);
      }
   });


   var EditionView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'reader/biblio/main/edition.html'),
      tagName: 'section',
      className: 'edition',

      templateHelpers: function () {
         var title = this.model.getCanonicalTitle();
         return {
            title: title ? title.getFullTitle() : 'Unknown Title',
            copyRef: this.copyRef
         };
      },

      events: {
         'click .edition-copy.readonline': function () {
            var copyId = this.copyRef.get('copyId');
            this.channel.trigger('bookreader:show', copyId);
         }
      },

      regions: {
         authors: '> .partition > .partition-body > .citation > .authors',
         pubInfo: '> .partition > .partition-body > .citation > .pubinfo'
      },

      initialize: function (options) {
         this.mergeOptions(options, ['channel', 'copyRefs']);

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


         var pubInfoView = new PublicationInfoView({
            model: this.model.get('publicationInfo')
         });

         this.getRegion('pubInfo').show(pubInfoView);


         if (this.model.has('volumes') && !this.model.get('volumes').isEmpty()) {
            var volumesView = new VolumesView({
               collection: this.model.get('volumes'),
               copyRefs: this.copyRefs,
               channel: this.channel
            });

            this.addRegion('volumes', '> .partition > .partition-body > .volumes > div');
            this.getRegion('volumes').show(volumesView);
         }
      }
   });


   var EditionsView = Marionette.CollectionView.extend({
      childView: EditionView,

      childViewOptions: function () {
         return {
            channel: this.channel,
            copyRefs: this.copyRefs
         };
      },

      initialize: function (options) {
         this.mergeOptions(options, ['channel', 'copyRefs']);
      }
   });


   var RelationshipView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'reader/biblio/main/relationship.html'),
      tagName: 'li',
      className: 'relationship',

      regions: {
         authors: '> .authors'
      },

      templateHelpers: function () {
         var title = this.model.get('target').getCanonicalTitle();
         return {
            title: title ? title.getFullTitle() : 'Unknown Title'
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
      childView: RelationshipView,
      tagName: 'ul',
      className: 'relationships',

      childViewOptions: function () {
         return {
            channel: this.channel
         };
      },

      initialize: function (options) {
         this.mergeOptions(options, ['channel']);
      }
   });


   var WorkDisplayView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'reader/biblio/main/work.html'),
      tagName: 'article',
      className: 'work',

      templateHelpers: function () {
         var title = this.model.getCanonicalTitle();
         return {
            title: title ? title.getFullTitle() : 'Unknown Title',
            copyRef: this.copyRef,
            relationships: this.relationships
         };
      },

      events: {
         'click .work-copy.readonline': function () {
            var copyId = this.copyRef.get('copyId');
            this.channel.trigger('bookreader:show', copyId);
         }
      },

      regions: {
         authors: '> .citation > .authors'
      },

      initialize: function (options) {
         this.mergeOptions(options, ['copyRefs', 'relationships', 'channel']);

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

   return WorkDisplayView;

});
