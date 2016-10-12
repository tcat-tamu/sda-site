# Citation Style Language (CSL) Resources

[citeproc-js][] needs locale and style information in order to operate properly, as demonstrated in the following code snippet:

    var sys = {
      retrieveLocale: function (lang) {
         return '<locale xmlns="http://purl.org/net/xbiblio/csl" ...';
      },
      retrieveItem: function (itemId) {
         return bibliographyData[itemId];
      }
    }
    var style = '<style xmlns="http://purl.org/net/xbiblio/csl" ...';
    var citeproc = new CSL.Engine(sys, style);
    citeproc.updateItems(refs);
    var biblInfo = citeproc.makeBibliography();
    // render items in biblInfo[1]

## Locales

Included locales are:

* English (United States) (**en-US.xml**)

More locales are available from Zotero's [Locale GitHub Repository][locale-repo].

## Styles

Styles are located in the **styles** directory. Included styles are:

* Modern Language Association (7th Edition) (**modern-language-association.csl**)
* Chicago Manual of Style (16th Edition; author-date) (**chicago-author-date.csl**)

More styles are available from the [Zotero Style Repository][style-repo].


[locale-repo]: https://github.com/citation-style-language/locales
[style-repo]: https://www.zotero.org/styles
