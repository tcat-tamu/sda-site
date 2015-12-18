(function () {
   'use strict';

   angular
      .module('sda')
      .factory('cslBuilder', cslBuilderFactory);

   /** @ngInject */
   function cslBuilderFactory(CSL, $http, $q, _) {

      var localePs = {};
      var stylePs = {};
      var defaultLocale = 'en-US';

      var API = {};

      API.addLocale = addLocale;
      API.addStyle = addStyle;
      API.setDefaultLocale = setDefaultLocale;
      API.getEngine = getEngine;
      API.renderBibliography = renderBibliography;

      return API;

      /**
       * Add a new locale
       *
       * @param {string} lang
       * @param {string} uri
       * @return {cslBuilder}
       */
      function addLocale(lang, uri) {
         localePs[lang] = $http.get(uri).then(function (resp) {
            return resp.data;
         });

         return API;
      }

      /**
       * Sets a default locale
       *
       * @param {string} lang
       * @return {cslBuilder}
       */
      function setDefaultLocale(lang) {
         defaultLocale = lang;

         return API;
      }

      /**
       * Add a new style definition
       *
       * @param {string} id
       * @param {string} uri
       * @return {cslBuilder}
       */
      function addStyle(id, uri) {
         stylePs[id] = $http.get(uri).then(function (resp) {
            return resp.data;
         });

         return API;
      }

      /**
       * Asynchronously constructs a CSL engine for the given bibliography and style.
       *
       * @param {Object} bibliography
       * @param {string} styleId
       * @return {Promise.<CSL.Engine>}
       */
      function getEngine(bibliography, styleId) {
         if (!bibliography) {
            throw new Error('no bibliography provided');
         }

         if (!stylePs[styleId]) {
            throw new Error('attempted to load unregistered style ' + styleId);
         }

         // resolve all async components
         var dataP = $q.all({
            locales: $q.all(localePs),
            style: stylePs[styleId]
         });

         // construct CSL engine
         return dataP.then(function (data) {
            var sys = {
               retrieveLocale: function (lang) {
                  if (!data.locales[lang]) {
                     throw new Error('attempted to load unregistered locale ' + lang);
                  }

                  return data.locales[lang];
               },

               retrieveItem: function (itemId) {
                  if (!bibliography[itemId]) {
                     throw new Error('attempted to load unknown bibliographic item ' + itemId);
                  }

                  return bibliography[itemId];
               }
            };

            return new CSL.Engine(sys, data.style, defaultLocale);
         });
      }

      /**
       * Renders a bibliography and citations into HTML snippets for insertion into a web page.
       *
       * @param {(BibliographyMap|BibliographyItem[])} bibliography
       * @param {Citation[]} citations
       * @param {string} style
       * @return {Promise.<BibliographyView>}
       */
      function renderBibliography(bibliography, citations, styleId) {
         return getEngine(bibliography, styleId).then(onCiteprocLoad);

         /**
          * Callback for after citeproc loads asynchronously
          *
          * @param {CSL.Engine} citeproc
          * @return {BibliographyView}
          */
         function onCiteprocLoad(citeproc) {
            /**
             * @type {string[]}
             */
            var citationIds = _.chain(citations)
               .pluck('citationItems').flatten()
               .pluck('id')
               .unique()
               .value();

            // tell citeproc in advance exactly which items will be cited
            citeproc.updateItems(citationIds);

            /**
             * @type {CitationView[]}
             */
            var citationViews = citations.map(function (citation) {
               // second argument indicates that citeproc already knows all items in advance
               var citeData = citeproc.appendCitationCluster(citation, true);

               return {
                  id: citation.citationID,
                  citation: citation,
                  index: citeData[0][0],
                  html: citeData[0][1]
               };
            });

            var bibliographyData = citeproc.makeBibliography();

            return {
               citations: citationViews,
               metadata: bibliographyData[0],
               items: bibliographyData[1]
            };
         }
      }
   }

})();
