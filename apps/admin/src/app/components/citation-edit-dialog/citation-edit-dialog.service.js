(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .factory('citationEditDialog', CitationEditDialogFactory);

  /** @ngInject */
  function CitationEditDialogFactory($mdDialog, _, refsRepoFactory) {
    return {
      show: show
    };

    /**
     * Displays the edit dialog.
     * @param  {ReferenceCollection} references
     * @param  {Citation} [citation]
     * @param  {MouseEvent} [$event]
     * @return {Promise.<ReferenceCollection>}
     */
    function show(references, citation, $event) {
      if (!citation) {
        var citations = _.values(references.citations);

        if (citations.length === 0) {
          citation = refsRepoFactory.createCitation();
          references.citations[citation.id] = citation;
        } else {
          citation = citations[0];
        }
      } else if (angular.isString(citation)) {
        citation = references.citations[citation];
      }

      if (!citation) {
        throw new Error('Unable to find a suitable citation. Please pass one explicitly or check that the reference collection is not malformed');
      }

      var config = {
        targetEvent: $event,
        templateUrl: 'app/components/citation-edit-dialog/citation-edit-dialog.html',
        controller: 'CitationEditDialogController',
        controllerAs: 'vm',
        clickOutsideToClose: false,
        locals: {
          references: references,
          citation: citation
        }
      };

      return $mdDialog.show(config).then(function () {
        return references;
      });
    }
  }

})();
