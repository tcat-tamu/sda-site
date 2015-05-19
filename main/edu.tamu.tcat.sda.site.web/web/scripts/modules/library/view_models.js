define(function (require) {

   var Backbone = require('backbone');

   var SimpleRelationship = Backbone.Model.extend({

      defaults: {
         type: '',
         target: null
      }

   });

   return {
      SimpleRelationship: SimpleRelationship,
      SimpleRelationships: Backbone.Collection.extend({ model: SimpleRelationship })
   };

});
