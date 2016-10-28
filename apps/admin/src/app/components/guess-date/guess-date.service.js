(function () {
  'use strict';

  /**
  * Formats ranked by precedence to check for when parsing date strings.
  *
  * NOTE: dashes can be any number of non-alphanumeric characters, so 'DD-MM-YYYY' parses
  *       '02/02/2015', '02.02.2015', '02:02,2015', and '02*#!02   ^^^2015' into '02-02-2015'
  *
  * @type {Array}
  */
  var INFER_FORMATS = [
    // year
    'YYYY',             // e.g. 2015

    // month year
    'MMMM-YYYY',        // e.g. February 2015
    'MMM-YYYY',         // e.g. Feb. 2015
    'MM-YYYY',          // e.g. 02/2015
    'M-YYYY',           // e.g. 2/2015

    // year month
    'YYYY-MMMM',        // e.g. 2015 February
    'YYYY-MMM',         // e.g. 2015 Feb.
    'YYYY-MM',          // e.g. 2015-02
    'YYYY-M',           // e.g. 2015-2

    // month day year
    'MMMM-DD-YYYY',     // e.g. February 02, 2015
    'MMM-DD-YYYY',      // e.g. Feb. 02, 2015
    'MM-DD-YYYY',       // e.g. 02/02/2015
    'M-DD-YYYY',        // e.g. 2/02/2015
    'MMMM-D-YYYY',      // e.g. February 2, 2015
    'MMM-D-YYYY',       // e.g. Feb. 2, 2015
    'MM-D-YYYY',        // e.g. 02-2-2015
    'M-D-YYYY',         // e.g. 2/2/2015

    // day month year
    'DD-MMMM-YYYY',     // e.g. 02 February 2015
    'DD-MMM-YYYY',      // e.g. 02 Feb. 2015
    'DD-MM-YYYY',       // e.g. 02/02/2015
    'DD-M-YYYY',        // e.g. 02/2/2015
    'D-MMMM-YYYY',      // e.g. 2 February 2015
    'D-MMM-YYYY',       // e.g. 2 Feb. 2015
    'D-MM-YYYY',        // e.g. 2/02/2015
    'D-M-YYYY',         // e.g. 2/2/2015

    // year month day
    'YYYY-MM-DD',       // e.g. 2015-02-02
    'YYYY-M-D'          // e.g. 2015-2-2
  ];

  angular
    .module('sdaAdmin')
    .factory('guessDate', guessDateFactory);

  /** @ngInject */
  function guessDateFactory(moment) {
    return guessDate;

    /**
     * Parse a date string into a Moment.
     *
     * See moment.js
     *
     * @param  {string} str Date string to parse
     * @return {Moment}     Parsed moment
     */
    function guessDate(str) {
        return moment(str, INFER_FORMATS);
    }
  }

})();
