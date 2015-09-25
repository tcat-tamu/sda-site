define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var AuthorView = Marionette.ItemView.extend({
      template: function (ctx) {
         var fname = ctx.firstName ? ctx.firstName : '';
         var lname = ctx.lastName ? ctx.lastName : '';
         return fname + ' ' + lname + ' ';
      },

      tagName: 'a',

      className: 'author',

      events: {
         click: function (evt) {
            evt.preventDefault();
            var authorId = this.model.get('authorId');

            if (authorId) {
               this.channel.trigger('author:show', authorId);
            }
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
         if (!this.model.get('authorId')) {
            this.$el.addClass('disabled');
         }
      }
   });


   var AuthorsView = Marionette.CollectionView.extend({
      tagName: 'span',
      className: 'authors',
      childView: AuthorView,

      childViewOptions: function () {
         return {
            channel: this.channel
         };
      },

      initialize: function (options) {
         this.mergeOptions(options, ['channel']);
      }
   });


   return AuthorsView;

});
