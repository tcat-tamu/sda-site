/**
 * @callback styleSupplierCallback
 * @return {Promise.<string>} style definition
 */
/**
 * @callback localeSupplierCallback
 * @return {Promise.<string>} locale definition
 */
/**
 * @callback bibliographyItemSupplierCallback
 * @param {string} itemId
 * @return {CslItemDTO}
 */
(function () {
  'use strict';

  angular
    .module('trcRefs')
    .provider('citeproc', citeprocProvider);

  /** @ngInject */
  function citeprocProvider(_) {
    /** @type {object.<string,localeSupplierCallback>} */
    var localeSuppliers = {};

    /** @type {object.<string,Promise.<string>>} */
    var loadedLocales = {};

    /** @type {object.<string,styleSupplierCallback} */
    var styleSuppliers = {};

    /** @type {object.<string,Promise.<string>>} */
    var loadedStyles = {};

    var provider = {
      defaultLocale: 'en-US',
      addLocale: addLocale,
      addStyle: addStyle,
      $get: citeprocFactory
    };

    return provider;

    /**
     * Register a locale with the citeproc provider
     * @param {string} localeId
     */
    function addLocale(localeId, supplier) {
      localeSuppliers[localeId] = supplier;
    }

    /**
     * Register a style with the citeproc provider
     * @param {string} styleId
     * @param {styleProviderCallback} provider
     */
    function addStyle(styleId, supplier) {
      styleSuppliers[styleId] = supplier;
    }


    /** @ngInject */
    function citeprocFactory($q, $injector, CSL) {
      // HACK: have to load all locales in order for sys.retrieveLocale to work as citeproc expects
      //       might as well kick it off as soon as the service is injected
      var localesP = loadLocales();
      return { load: getEngine };

      /**
       * Constructs a citeproc instance with the given style
       * @param  {string} styleId
       * @param  {bibliographyItemSupplierCallback} bibliographyItemSupplier
       * @return {Promise.<CSL.Engine>}
       */
      function getEngine(styleId, bibliographyItemSupplier) {
        var paramsP = $q.all({
          style: loadStyle(styleId),
          locales: localesP
        });

        return paramsP.then(function (params) {
          var citeprocSys = {
            retrieveLocale: getLocale,
            retrieveItem: getBibliographyItem
          };

          return new CSL.Engine(citeprocSys, params.style, provider.defaultLocale);

          /**
           * Retrieves a locale for the citeproc engine
           * @param  {string} lang
           * @return {string}
           */
          function getLocale(lang) {
            if (!params.locales.hasOwnProperty(lang)) {
              throw new Error('unknown locale ' + lang);
            }

            return params.locales[lang];
          }
        });

        /**
         * Retrieves a bibliographic item by ID for the citeproc engine
         * @param {string} id
         * @return {CslItemDTO}
         */
        function getBibliographyItem(id) {
          var item = bibliographyItemSupplier(id)

          if (!item) {
            throw new Error('bibliography item supplier failed to return an item for id {' + id + '}');
          }

          return item;
        }
      }

      /**
       * Loads the locale with the given id
       * Ensures corresponding supplier is called only once
       * @return {Promise.<string>}
       */
      function loadLocale(localeId) {
        if (!localeSuppliers.hasOwnProperty(localeId)) {
          throw new Error('unknown locale ' + localeId);
        }

        if (!loadedLocales.hasOwnProperty(localeId)) {
          var localeSupplier = localeSuppliers[localeId];
          loadedLocales[localeId] = $injector.invoke(localeSupplier);
        }

        return loadedLocales[localeId];
      }

      /**
       * Loads the style with the given id
       * Ensures corresponding supplier is called only once
       * @return {Promise.<string>}
       */
      function loadStyle(styleId) {
        if (!styleSuppliers.hasOwnProperty(styleId)) {
          throw new Error('unknown style ' + styleId);
        }

        if (!loadedStyles.hasOwnProperty(styleId)) {
          var styleSupplier = styleSuppliers[styleId];
          loadedStyles[styleId] = $injector.invoke(styleSupplier);
        }

        return loadedStyles[styleId];
      }

      /**
       * Loads all locales by calling their suppliers and syncing all of the resulting promises.
       * @return {Promise.<object.<string,string>>}
       */
      function loadLocales() {
        var locales = _.mapValues(localeSuppliers, function (supplier, localeId) {
          return loadLocale(localeId);
        });

        return $q.all(locales);
      }
    }
  }

})();