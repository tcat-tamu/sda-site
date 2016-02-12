// CITEPROC-JS TYPES
// note: some types may be incomplete

/**
 * Bibliographic person name replesentation
 * @see {@link https://github.com/citation-style-language/schema/blob/master/csl-data.json}
 *
 * @typedef Name
 * @type {object}
 * @property {?string} given
 * @property {?string} family
 * @property {?string} suffix
 * @property {?string} comma-suffix - If true, suffix is preceded by a comma (",").
 * @property {?string} literal - Institutional and other names that should always be presented literally should use this field instead of given/family/etc.
 * @property {?string} dropping-particle
 * @property {?string} non-dropping-particle
 * @property {?boolean} static-ordering
 */

/**
 * Bibliographic date representation
 * @see {@link https://github.com/citation-style-language/schema/blob/master/csl-data.json}
 *
 * @typedef DateParts
 * @type {object}
 * @property {?string} literal
 * @property {(string|number)[][]} date-parts
 * @property {?string} season
 * @property {?boolean} circa

/**
 * Single CSL bibliographic input item
 * @see {@link https://github.com/citation-style-language/schema/blob/master/csl-data.json}
 *
 * @typedef BibliographyItem
 * @type {object}
 * @property {string} id - Unique identifier for the bibliographic entry
 * @property {string} type
 * @property {?Name[]} author
 * @property {?Name[]} editor
 * @property {?string} title
 * @property {?string} edition
 * @property {?string} volume
 * @property {?DateParts} issued
 * @property {?DateParts} accessed
 * @property {?string} URL
 */

/**
 * Errors related to rendering cited bibliographic items into HTML
 *
 * @typedef BibliographyError
 * @type {object}
 * @property {string} citationID - The ID of the offending citation.
 * @property {integer} index - Positional information.
 * @property {string} itemID - Offending item within the citation.
 * @property {integer} error_code - Bitwise error code. Currently always CSL.ERROR_NO_RENDERED_FORM.
 */

/**
 * Bibliographic metadata returned along with rendered HTML items
 *
 * @typedef BibliographyMetadata
 * @type {object}
 * @property {integer} maxoffset - The maximum number of characters that appear in any label used in the bibliography.
 * @property {integer} entryspacing - The spacing between entries in the bibliography.
 * @property {integer} linespacing - The spacing between the lines within each bibliography entry.
 * @property {number} hangingindent - The number of em-spaces to apply in hanging indents within the bibliography.
 * @property {boolean} second-field-align - If the second-field-align CSL option is set, this returns either "flush" or "margin"; otherwise set to false.
 * @property {string} bibstart - A string to be appended to the front of the finished bibliography string.
 * @property {string} bibend - A string to be appended to the end of the finished bibliography string.
 * @property {BibliographyError[]} bibliography_errors
 */

/**
 * References a cited bibliographic item by ID
 *
 * @typedef CitationItem
 * @type {object}
 * @property {string} id - The unique identifier for a bibliographic item.
 * @property {?string} locator - A string identifying a page number or other pinpoint location or range within the resource.
 * @property {?string} label - A label type, indicating whether the locator is to a page, a chapter, or other subdivision of the target resource. Valid labels are defined in {@link http://citationstyles.org/}.
 * @property {?boolean} suppress-author - If true, author names will not be included in the citation output for this cite.
 * @property {?boolean} author-only - If true, only the author name will be included in the citation output for this cite.
 * @property {?string} prefix - A string to print before this cite item.
 * @property {?string} suffix - A string to print after this cite item.
 */

/**
 * Properties relating to a citation item
 *
 * @typedef CitationProperties
 * @type {object}
 * @property {integer} noteIndex - Indicates the footnote number in which the citation is located within the document. Citations within the main text of the document have a noteIndex of zero.
 */

/**
 * An in-text citation containing a collection of one or more cited bibliographic items for
 *
 * @typedef Citation
 * @type {object}
 * @property {string} citationID - Unique identifier for the citation.
 * @property {CitationItem[]} citationItems - References to bibliographic items.
 * @property {CitationProperties} properties
 */


// LOCAL TYPES

/**
 * Input bibliographic data for CSL engine builder
 *
 * @typedef BibliographyMap
 * @type {Object.<string, BibliographyItem>}
 */

/**
 * Information relevant to displaying a citation in an HTML view
 *
 * @typedef CitationView
 * @type {object}
 * @property {string} id - An alias for {@linkcode Citation.citationID}.
 * @property {Citation} citation - The underlying citation that was rendered to produce this view item.
 * @property {integer} index - Index in the output list.
 * @property {string} html - Rendered HTML.
 */

/**
 * Information relevant to displaying a bibliography in an HTML view
 *
 * @typedef BibliographyView
 * @type {object}
 * @property {CitationView[]} citations - Rendered citation viewse
 * @property {BibliographyMetadata} metadata - Additional output from CSL engine.
 * @property {string[]} items - Rendered bibliography HTML.
 */

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
       * @param {(BibliographyMap|BibliographyItem[])} bibliography
       * @param {string} styleId
       * @return {Promise.<CSL.Engine>}
       */
      function getEngine(bibliography, styleId) {
         if (!bibliography) {
            throw new Error('no bibliography provided');
         }

         if (angular.isArray(bibliography)) {
            bibliography = _.indexBy(bibliography, 'id');
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
            var citationViews = _.map(citations || [], function (citation) {
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
