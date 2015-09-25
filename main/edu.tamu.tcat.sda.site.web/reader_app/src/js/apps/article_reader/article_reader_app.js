define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var LayoutView = require('./views/layout_view');
   var ArticleReaderView = require('./views/article_reader_view');
   var TableOfContentsView = require('./views/table_of_contents_view');
   var MathJaxLoader = require('mathjax');


   var ArticleReaderController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.region) {
            throw new TypeError('no main region provided');
         }

         if (!opts.repo) {
            throw new TypeError('no articles repository provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['region', 'repo', 'channel']);
      },

      ensureLayoutView: function () {
         if (!this.layoutView) {
            this.layoutView = new LayoutView();

            this.layoutView.on('destroy', function () {
               this.layoutView = null;
            }, this);

            this.region.show(this.layoutView);
         }

         return this.layoutView;
      },

      displayArticle: function (id) {
         MathJaxLoader.load()
            .catch(function (err) {
               console.error('Unable to load MathJax. LaTeX Equations will not be rendered.', err);
            });

         this.repo.find(id)
            .bind(this)
            .then(function (article) {
               var articleView = new ArticleReaderView({
                  model: article,
                  channel: this.channel
               });

               articleView.on('show', function () {
                  var tocView = new TableOfContentsView({
                     toc: articleView.getToc(),
                     channel: this.channel
                  });

                  var layout = this.ensureLayoutView();
                  layout.getRegion('sidebar').show(tocView);
               }, this);

               var layout = this.ensureLayoutView();
               layout.getRegion('main').show(articleView);
            });
      }

   });


   var ArticleReaderRouter = Marionette.AppRouter.extend({
      appRoutes: {
         'read/:id': 'displayArticle'
      }
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         var controller = new ArticleReaderController({
            region: opts.region,
            repo: opts.repo,
            channel: opts.channel
         });

         var router = new ArticleReaderRouter({
            controller: controller
         });

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         opts.channel.on('article:show', function (id) {
            router.navigate('read/' + id);
            controller.displayArticle(id);
         });

         return router;
      }
   };

});
