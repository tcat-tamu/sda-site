define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var SearchFormView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'articles/search/search_form.html'),

      tagName: 'form',

      className: 'search',

      ui: {
         queryInput: 'input[name="query"]'
      },

      events: {
         'submit': function (evt) {
            evt.preventDefault();
            this.trigger('search', this.ui.queryInput.val(), {
               // TODO: other search options
            });
         }
      }

   });

   return SearchFormView;

});
