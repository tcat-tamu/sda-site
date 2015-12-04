(function () {
   'use strict';

   angular
      .module('sda')
      .factory('cslBuilder', cslBuilderFactory);

   /** @ngInject */
   function cslBuilderFactory(CSL, $http, $q) {

      var localePs = {};
      var stylePs = {};
      var defaultLocale = 'en-US';

      var API = {};

      API.addLocale = addLocale;
      API.addStyle = addStyle;
      API.setDefaultLocale = setDefaultLocale;
      API.getEngine = getEngine;

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
   }
})();
