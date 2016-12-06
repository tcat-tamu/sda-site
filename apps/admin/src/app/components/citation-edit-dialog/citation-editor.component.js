/**
 * @typedef ItemContainer
 * @type {object}
 * @property {string} id
 * @property {string} label
 * @property {BiblioItem} item
 */

(function () {
  'use strict';

  var LOCATOR_TYPES = [
    'book', 'chapter', 'column', 'figure', 'folio', 'issue', 'line', 'note', 'opus', 'page',
    'paragraph', 'part', 'section', 'sub verbo', 'verse', 'volume'
  ];

  var ZOTERO_USER_ACCOUNT_ID = '2536190';
  var ZOTERO_USER_ACCOUNT_API_KEY = '3A4q05BNg0h0bHKJkpoCi1Oa';
  var ZOTERO_GROUP_ID = '381134';

  angular
    .module('sdaAdmin')
    .component('citationEditor', {
      templateUrl: 'app/components/citation-edit-dialog/citation-editor.html',
      controller: CitationEditorController,
      bindings: {
        references: '=',
        citation: '='
      }
    });

  /** @ngInject */
  function CitationEditorController($filter, $q, $log, $mdDialog, zotero, _, sdaToast, refsRepoFactory, refsRenderer) {
    var vm = this;

    // referenced item autocomplete models
    vm.selectedBiblioItem = null;
    vm.searchText = '';

    vm.locatorTypes = LOCATOR_TYPES;

    vm.activeCitationItem = {};

    vm.groupLibraryP = null;

    vm.zoteroItem = null

    vm.search = search;
    vm.addCitationItem = addCitationItem;
    vm.selectBiblioItem = selectBiblioItem;
    vm.edit = editCitationItem;
    vm.createZoteroItem = createZoteroItem;
    vm.cancelZoteroItem = cancelZoteroItem;
    vm.saveZoteroItem = saveZoteroItem;

    var stripTags = $filter('stripTags');

    activate();

    function activate() {
      var account = zotero.getUserAccount(ZOTERO_USER_ACCOUNT_ID, ZOTERO_USER_ACCOUNT_API_KEY);

      // account.getGroup and account.getLibrary return native Promises.
      // we wrap them in $q promises for consistency
      var groupP = $q.when(account.getGroup(ZOTERO_GROUP_ID));
      vm.groupLibraryP = groupP.then(function (group) {
        return $q.when(account.getLibrary(group));
      });

      if (!vm.citation) {
        throw new Error('no citation provided');
      }

      if (!vm.references.citations[vm.citation.id]) {
        $log.warn('Citation is not a member of the provided reference collection. Adding to collection...');
        vm.references.citations[vm.citation.id] = vm.citation;
      } else if (vm.references.citations[vm.citation.id] !== vm.citation) {
        $log.warn('provided citation does not match citation in reference collection. Overriding...');
        vm.references.citations[vm.citation.id] = vm.citation;
      }
    }

    /**
     * Provides autocomplete items
     * @param  {string} query
     * @return {Promise.<ItemContainer[]>}
     */
    function search(query) {
      return vm.groupLibraryP.then(function (library) {
        // library.searchItems returns a native Promise.
        // we wrap that in a $q promise for consistency
        var resultsP = $q.when(library.searchItems(query))

        var adaptedResultsP = resultsP.then(function (items) {
          return $q.all(items.map(adaptItem).map(wrapItem));
        });

        adaptedResultsP.catch(function () {
          sdaToast.error('Unable to load search results.');
        });

        return adaptedResultsP;
      });
    }

    /**
     * Adapts a ZoteroItem for use in the autocomplete field and citation metadata
     * @param  {ZoteroItem} zItem
     * @return {BiblioItem}
     */
    function adaptItem(zItem) {
      var id = 'zotero/' + zItem.library.id + '/' + zItem.id;

      var item = refsRepoFactory.createBiblioItem(id);
      item.type = zItem.type;
      item.creators = zItem.properties.creators.map(adaptCreator);

      // NOTE: this omits a lot of metadata fields... need to decide what other metadata (if any) to keep.

      item.meta = angular.extend(
        _.pick(zItem.meta, ['creatorSummary', 'parsedDate']),
        _.pick(zItem.properties, ['key', 'dateAdded', 'dateModified'])
      );

      item.fields = _.omit(zItem.properties, [
        // these properties are extracted to the top-level item
        'creators', 'itemType',
        // these properties are extracted to metadata
        'key', 'dateAdded', 'dateModified',
        // these properties are just forgotten
        'version', 'collections', 'tags', 'relations'
      ]);

      return item;
    }

    /**
     * Adapts a Zotero creator for use in the BiblioItem TRC-local type
     * @param  {ZoteraCreator}
     * @return {Creator}
     */
    function adaptCreator(zCreator) {
      return {
        role: zCreator.creatorType,
        firstName: zCreator.firstName,
        lastName: zCreator.lastName,
        name: zCreator.name
      };
    }

    /**
     * Wraps a BiblioItem for use in the autocomplete field and citation metadata
     * @param  {BiblioItem} item
     * @return {Promise.<ItemContainer>}
     */
    function wrapItem(item) {
      var labelP = refsRenderer.renderBiblioItem('modern-language-association', item);

      return labelP.then(function (label) {
        return {
          id: item.id,
          label: label,
          item: item
        };
      });
    }

    /**
     * Appends the given citation item to the citation
     * @return {CitationItem}
     */
    function addCitationItem(citationItem) {
      if (vm.citation.items.indexOf(citationItem) < 0) {
        // new item
        vm.citation.items.push(citationItem);
      } else {
        // edited existing item in-place
      }

      // set/update label
      var referencedBibItem = vm.references.bibliography[citationItem.id];
      renderCitationItemLabel(citationItem, referencedBibItem).then(function (label) {
        citationItem.label = label;
      });

      // clear active item and start editing a new one
      clearForm();
    }

    /**
     * Sets the current citation item's referent id to the given item's id and
     * adds the given item to the bibliography
     * @param {ItemContainer} itemContainer
     */
    function selectBiblioItem(itemContainer) {
      if (itemContainer) {
        vm.activeCitationItem.id = itemContainer.id;
        vm.references.bibliography[itemContainer.id] = itemContainer.item;
      } else {
        vm.activeCitationItem.id = null;
      }
    }

    /**
     * Sets the given citation item as the item being actively edited
     * @param {CitationItem} item
     */
    function editCitationItem(citationItem) {
      var biblioItem = vm.references.bibliography[citationItem.id];
      return wrapItem(biblioItem).then(function (biblioItemContainer) {
        vm.activeCitationItem = citationItem;
        vm.selectedBiblioItem = biblioItemContainer;
        vm.searchText = stripTags(vm.selectedBiblioItem.label);
      });
    }

    /**
     * Resets the model behind the citation item form
     */
    function clearForm() {
      vm.activeCitationItem = {};
      vm.searchText = '';
      vm.selectedBiblioItem = null;
    }

    /**
     * Renders a label for a single citation item
     * @praam {CitationItem} citationItem
     * @param {ZoteroItem} biblioItem Corresponding bibliographic item
     * @return {Promise.<string>}
     */
    function renderCitationItemLabel(citationItem, biblioItem) {
      // create a singleton citation for the citation item
      var citation = refsRepoFactory.createCitation();
      citation.items.push(citationItem);

      // create a singleton reference for the singleton citation
      var reference = refsRepoFactory.createRefCollection();
      reference.citations[citation.id] = citation;
      reference.bibliography[citationItem.id] = biblioItem;

      var renderedP = refsRenderer.render('modern-language-association', reference);

      return renderedP.then(function (rendered) {
        return rendered.citations[citation.id];
      });
    }

    function createZoteroItem() {
      vm.zoteroItem = {};
    }

    function cancelZoteroItem() {
      vm.zoteroItem = null;
    }

    function saveZoteroItem($event, item) {
      var zItemP = vm.groupLibraryP.then(function (library) {
        // library.saveItem returns a native Promise.
        // we wrap that in a $q promise for consistency
        return $q.when(library.saveItem(item));
      });

      var biblioItemP = zItemP.then(adaptItem);

      var itemContainerP = biblioItemP.then(wrapItem);

      itemContainerP.then(function (item) {
        vm.selectedBiblioItem = item;
        selectBiblioItem(item);
        vm.searchText = stripTags(item.label);
        vm.zoteroItem = null;
      }, function () {
        sdaToast.error('Unable to save zotero data');
      });
    }
  }

})();
