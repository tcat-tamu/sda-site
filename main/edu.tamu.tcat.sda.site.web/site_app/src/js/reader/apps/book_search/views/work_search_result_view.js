define(function (require) {

      var Marionette = require('marionette');
      var nunjucks = require('nunjucks');
      var _ = require('underscore');


      var WorkSearchResultView = Marionette.ItemView.extend({

         template: _.partial(nunjucks.render, 'reader/biblio/work_search_result.html'),

         className: 'work-search-result',

         events: {
            'click ol.authorList span.author': function(event) {
               event.stopPropagation();

               var authorId = event.target.dataset.id;
               if (!authorId) {
                  return;
               }

               var authors = this.model.get('authors');
               var authorRef = _.findWhere(authors, {
                  authorId: authorId
               });

               if (!authorRef) {
                  return;
               }

               this.trigger('author:click', authorRef);
            },

            'click': function() {
               this.trigger('work:click', this.model);
            }
         }

      });


   return WorkSearchResultView;

});
