(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('ShowPersonController', ShowPersonController);

  /** @ngInject */
  function ShowPersonController(peopleRepo, refsRepoFactory, articlesRepo, $log, $state, $stateParams, $mdDialog, sdaToast, _, personEditDialog, eventEditDialog, citationEditDialog, summaryEditDialog) {
    var refsRepo = null;
    var vm = this;

    vm.loading = true;
    vm.person = null;

    vm.editBioInfo = editBioInfo;
    vm.editEvent = editEvent;
    vm.editSummary = editSummary;
    vm.editBibliography = editBibliography;
    vm.createBiography = createBiographyArticle;
    vm.deletePerson = deletePerson;

    activate();

    function activate() {
      var personId = $stateParams.id;

      var personRefsUrl = peopleRepo.getReferencesEndpoint(personId);
      refsRepo = refsRepoFactory.getRepo(personRefsUrl);

      vm.person = peopleRepo.get(personId);
      vm.references = refsRepo.get();

      vm.references.$promise.then(function () {
        var citations = _.values(vm.references.citations);

        if (citations.length === 0) {
          vm.citation = refsRepo.createCitation();
          vm.references.citations[vm.citation.id] = vm.citation;
        } else {
          if (citations.length > 1) {
            $log.warn('reference collection contains ' + citations.length + ' citations');
          }
          vm.citation = citations[0];
        }
      })
    }

    function editBioInfo($event) {
      var dialogPromise = personEditDialog.show($event, angular.copy(vm.person));

      dialogPromise.then(function (updatedPerson) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        angular.extend(vm.person, updatedPerson);

        var savePromise = peopleRepo.save(vm.person);
        savePromise.then(showSavedToast, showErrorToast);
        return savePromise;
      });
    }

    function editEvent(field, $event) {
      var dialogPromise = eventEditDialog.show($event, angular.copy(vm.person[field]));

      dialogPromise.then(function (updatedEvent) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        angular.extend(vm.person[field], updatedEvent);

        var savePromise = peopleRepo.save(vm.person);
        savePromise.then(showSavedToast, showErrorToast);
        return savePromise;
      });
    }

    function editSummary($event) {
      var dialogPromise = summaryEditDialog.show($event, angular.copy(vm.person.summary));

      dialogPromise.then(function (updatedSummary) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        vm.person.summary = updatedSummary;

        var savePromise = peopleRepo.save(vm.person);
        savePromise.then(showSavedToast, showErrorToast);
        return savePromise;
      });
    }

    function editBibliography($event) {
      citationEditDialog.show(vm.references, null, $event).then(function () {
        var savePromise = refsRepo.save(vm.references);
        savePromise.then(showSavedToast, showErrorToast);
        return savePromise;
      });
    }

    function deletePerson($event, person) {
      var nameLabel = person.name.label ? '"' + person.name.label + '"' : 'this person';

      var confirmDialog = $mdDialog.confirm({
        targetEvent: $event,
        title: 'Confirm Deletion',
        textContent: 'Are you sure you want to delete ' + nameLabel + '?',
        ok: 'Yes',
        cancel: 'No'
      });

      var confirmPromise = $mdDialog.show(confirmDialog);

      return confirmPromise.then(function () {
        return peopleRepo.delete(person)
          .then(showSuccessToast, showErrorToast);
      });

      function showSuccessToast() {
        $state.go('editor');
        return sdaToast.success(nameLabel + ' has been deleted.');
      }

      function showErrorToast() {
        return sdaToast.error('Unable to delete ' + nameLabel);
      }
    }

    function createBiographyArticle($event, person) {
      // prompt for article title
      var articleTitleDialog = $mdDialog.prompt({
        targetEvent: $event,
        title: 'Create Biography',
        textContent: 'You are creating a new article attached to this person. Please enter a title for this article.',
        initialValue: person.name.label,
        ok: 'Create',
        cancel: 'Cancel'
      });

      var titleP = $mdDialog.show(articleTitleDialog);

      titleP.then(function (title) {
        var articleP = articlesRepo.createLinked('biography', title, person.ref.token);

        // redirect to article editor
        articleP.then(function (article) {
          $state.go('article.edit', {
            id: article.id
          });
        }, function () {
          return sdaToast.error('Unable to create article.');
        });
      });
    }

    function showSavedToast() {
      return sdaToast.success('Saved');
    }

    function showErrorToast() {
      return sdaToast.error('Unable to save data.');
    }
  }

})();
