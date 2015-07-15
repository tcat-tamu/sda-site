define(function (require) {

   var Backbone = require('backbone');
   var Marionette = require('marionette');
   var Promise = require('promise');
   var _ = require('underscore');

   var AuthorDisplayView = require('./views/author_display_view');


   var AuthorInfoController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.repo) {
            throw new TypeError('no people repository provided');
         }

         if (!opts.workRepo) {
            console.warn('no work repository provided; related works will be unavailable');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['region', 'repo', 'channel']);
      },

      displayAuthor: function (id) {
         var _this = this;

         var authorPromise = this.repo.find(id);
         var worksPromise = this.workRepo ? this.workRepo.searchByAuthor(id).map(function (result) {
            return result.getWork();
         }) : Promise.resolve([]);

         Promise.join(authorPromise, worksPromise, function (author, works) {
            var authorView = new AuthorDisplayView({
               model: author,
               works: new Backbone.Collection(works), // HACK: view expects a collection of works
               channel: _this.channel
            });

            _this.region.show(authorView);
         });
      }

   });


   var AuthorInfoRouter = Marionette.AppRouter.extend({
      appRoutes: {
         'author/:id': 'displayAuthor'
      }
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         var controller = new AuthorInfoController({
            region: opts.region,
            repo: opts.repo,
            workRepo: opts.workRepo,
            channel: opts.channel
         });

         var router = new AuthorInfoRouter({
            controller: controller
         });

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         opts.channel.on('author:show', function (id) {
            router.navigate('author/' + id);
            controller.displayAuthor(id);
         });

         return router;
      }
   };

});
