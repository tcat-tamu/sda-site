define(function (require) {

   var Marionette = require('marionette');
   var Promise = require('promise');
   var _ = require('underscore');


   var RelationshipViewTypes = require('./entities/relationships');
   var RelationshipCollection = RelationshipViewTypes.RelationshipCollection;

   var WorkDisplayView = require('./views/work_display_view');


   var WorkInfoController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.sideRegion) {
            throw new TypeError('no side region provided');
         }

         if (!opts.workRepo) {
            throw new TypeError('no works repository provided');
         }

         if (!opts.copyRefRepo) {
            throw new TypeError('no digital copy reference repository provided');
         }

         if (!opts.relnRepo) {
            throw new TypeError('no relationships repository provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['region', 'sideRegion', 'workRepo', 'copyRefRepo', 'relnRepo', 'channel']);

         this.relnTypesPromise = this.relnRepo.findTypes();
      },

      displayWork: function (id) {
         var _this = this;
         // TODO start spinner

         var workPromise = this.workRepo.findWork(id);

         var copyRefsPromise = workPromise.then(function (work) {
            return _this.copyRefRepo.findAll(work.getUri());
         });

         var relationshipsPromise = workPromise.then(function (work) {
            return _this.relnRepo.findAllByUri(work.getUri());
         });

         /**
          * Transform a collection of anchors into attributes for simple relationships,
          * each containing a relationship type name and a target work object.
          *
          * @param  {string}              typeName Name of relationship type already normalized for reverse relationships
          * @param  {Backbone.Collection} anchors  Collection of anchors to transform
          * @return {array}                        An array of promises that resolve to simple relationship attributes.
          */
         function getSimpleRelationshipsPromise(typeName, anchors) {
            return anchors.chain()
               .invoke('get', 'entryUris')
               .flatten(true)
               .map(function (uri) {
                  return _this.workRepo.find(uri).then(function (relatedEntry) {
                     return {
                        type: typeName,
                        target: relatedEntry.model,
                        targetType: relatedEntry.type
                     };
                  });
               })
               .value();
         }

         var typedRelationshipsPromise = Promise
            .join(workPromise, this.relnTypesPromise, relationshipsPromise, function (work, relnTypes, relationships) {
               var workUri = work.getUri();

               return relationships.chain()
                  .map(function (relationship) {
                     var typeId = relationship.get('typeId');
                     var type = relnTypes.get(typeId);

                     var isReverse = relationship.get('targetEntities').any(function (target) {
                        return _.contains(target.get('entryUris'), workUri);
                     });

                     var typeName = type.getTitle(isReverse);
                     var anchors = relationship.get(isReverse ? 'relatedEntities' : 'targetEntities');
                     return getSimpleRelationshipsPromise(typeName, anchors);
                  })
                  .flatten(true)
                  .value();
            })
            .all()
            .then(function (models) {
               return new RelationshipCollection(models);
            });

         Promise.join(workPromise, copyRefsPromise, typedRelationshipsPromise, function (work, copyRefs, relationships) {
            _this.focusedWorkViewOpts = {
               model: work,
               copyRefs: copyRefs,
               relationships: relationships,
               channel: _this.channel
            };

            var workView = new WorkDisplayView(_this.focusedWorkViewOpts);

            _this.region.show(workView);
         }).catch(function (err) {
            console.error('unable to display work');
            console.log(err);
         });
      },

      shiftWorkView: function () {
         if (!this.focusedWorkViewOpts) {
            return;
         }

         var workView = new WorkDisplayView(this.focusedWorkViewOpts);
         this.sideRegion.show(workView);
      }
   });


   var WorkInfoRouter = Marionette.AppRouter.extend({
      appRoutes: {
         'works/:id': 'displayWork'
      }
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         var controller = new WorkInfoController({
            region: opts.mainRegion,
            sideRegion: opts.sideRegion,
            workRepo: opts.workRepo,
            copyRefRepo: opts.copyRefRepo,
            relnRepo: opts.relnRepo,
            channel: opts.channel
         });

         var router = new WorkInfoRouter({
            controller: controller
         });

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         opts.channel.on('work:show', function (id) {
            router.navigate('works/' + id);
            controller.displayWork(id);
         });

         opts.channel.on('bookreader:show', function () {
            controller.shiftWorkView();
         });

         return router;
      }
   };

});
