/**
 * This module is meant only for inclusion at build time to grab all the necessary modules for
 * compilation. It should not be activated at runtime.
 */

define([
   'layout_behavior/fill_window',
   'legacy-main',
   'modules/library/bookreader',
   'modules/library/search'
], {});
