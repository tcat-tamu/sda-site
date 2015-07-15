define(function (require) {

   var Marionette = require('marionette');
   var moment = require('moment');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var RelatedWorksView = require('./related_works_view');

   var REGEX_STRIP_TAGS = /(<([^>]+)>)/ig;

   var env = nunjucks.configure();

   env.addFilter('date', function (dateStr, format) {
      return moment(dateStr).format(format);
   });

   env.addFilter('striptags', function (str) {
      return str.replace(REGEX_STRIP_TAGS, '');
   });


   var AuthorDisplayView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'bio/main/author.html'),
      className: 'author',

      templateHelpers: function () {
         return {
            works: this.works
         };
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['channel', 'works']);
      },

      onShow: function () {
         if (this.works && this.works.length > 0) {
            var relatedWorksView = new RelatedWorksView({
               channel: this.channel
            });

            this.addRegion('relatedWorks', '> .related-works > div');
            this.getRegion('relatedWorks').show(relatedWorksView);
         }
      }
   });


   return AuthorDisplayView;

});
