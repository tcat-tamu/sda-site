define(function (require) {

   var $ = require('jquery');

   var MATHJAX_CDN_URL = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';

   var mathjaxP = null;

   return {
      /**
       * Load MathJax from CDN
       *
       * @return {Promise} Resolves to MathJax instance on successful load
       */
      load: function () {
         if (!mathjaxP) {
            mathjaxP = new Promise(function (resolve, reject) {
               $.getScript(MATHJAX_CDN_URL)
                  .done(function () {
                     resolve(window.MathJax);
                  })
                  .fail(function (jqxhr) {
                     reject(new Error(jqxhr.status.toString() + ' ' + jqxhr.statusText));
                  });
            });
         }

         return mathjaxP;
      }
   };
});
