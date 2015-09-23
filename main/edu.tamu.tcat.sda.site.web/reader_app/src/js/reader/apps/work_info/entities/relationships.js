define(function (require) {

   var Backbone = require('backbone');

   var Relationship = Backbone.Model.extend({

      defaults: {
         type: '',
         target: null
      }

   });

   return {
      Relationship: Relationship,
      RelationshipCollection: Backbone.Collection.extend({ model: Relationship })
   };

});
