define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var REGEX_STRIP_TAGS = /(<([^>]+)>)/ig;

   var env = nunjucks.configure();

   env.addFilter('striptags', function (str) {
      return str.replace(REGEX_STRIP_TAGS, '');
   });


   var AuthorView = Marionette.ItemView.extend({
      template: function (ctx) {
         return ctx.lastName  + ', ' + ctx.firstName;
      },
      tagName: 'a',
      className: 'author'
   });

   var AuthorsView = Marionette.CollectionView.extend({
      tagName: 'span',
      className: 'authors',
      childView: AuthorView
   });

   var PublicationInfoView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'biblio/pubinfo.html'),
      tagName: 'span'
   });

   var VolumeView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'biblio/volume.html'),
      tagName: 'section',
      className: 'volume'
   });


   var VolumesView = Marionette.CollectionView.extend({
      childView: VolumeView
   });


   var EditionView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'biblio/edition.html'),
      tagName: 'section',
      className: 'edition',

      templateHelpers: function () {
         return {
            title: 'Hello, world!'
         };
      },

      regions: {
         authors: '> .partition > .partition-body > .citation > .authors',
         pubInfo: '> .partition > .partition-body > .citation > .pubinfo'
      },

      onShow: function () {
         var authorsView = new AuthorsView({
            collection: this.model.get('authors')
         });

         this.getRegion('authors').show(authorsView);


         var pubInfoView = new PublicationInfoView({
            model: this.model.get('publicationInfo')
         });

         this.getRegion('pubInfo').show(pubInfoView);


         if (this.model.has('volumes') &&  !this.model.get('volumes').isEmpty()) {
            var volumesView = new VolumesView({
               collection: this.model.get('volumes')
            });

            this.addRegion('volumes', '> .partition > .partition-body > .volumes > div');
            this.getRegion('volumes').show(volumesView);
         }
      }
   });


   var EditionsView = Marionette.CollectionView.extend({
      childView: EditionView
   });


   var WorkDisplayView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'biblio/work.html'),
      tagName: 'article',
      className: 'work book',

      templateHelpers: function () {
         return {
            title: 'Hello, world!'
         };
      },

      regions: {
         authors: '> .citation > .authors'
      },

      onShow: function () {
         var authorsView = new AuthorsView({
            collection: this.model.get('authors')
         });

         this.getRegion('authors').show(authorsView);


         if (this.model.has('editions') && !this.model.get('editions').isEmpty()) {
            var editionsView = new EditionsView({
               collection: this.model.get('editions')
            });

            this.addRegion('editions', '> .editions > div');
            this.getRegion('editions').show(editionsView);
         }
      }
   });


   return {
      WorkDisplayView: WorkDisplayView
   };

});
