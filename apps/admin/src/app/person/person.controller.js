(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .controller('ShowPersonController', ShowPersonController);

  /** @ngInject */
  function ShowPersonController(peopleRepo, refsRepoFactory, $log, $state, $stateParams, $mdDialog, $mdToast, _, citationEditDialog) {
    var refsRepo = null;
    var vm = this;

    vm.loading = true;
    vm.person = null;

    vm.editBioInfo = editBioInfo;
    vm.editEvent = editEvent;
    vm.editSummary = editSummary;
    vm.editBibliography = editBibliography;
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
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/person/person-edit-dialog.html',
        locals: {
          // create a copy for manipulation
          person: angular.copy(vm.person)
        },
        controller: 'PersonEditDialogController',
        controllerAs: 'vm'
      };

      var dialogPromise = $mdDialog.show(dialog);

      dialogPromise.then(function (updatedPerson) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        angular.extend(vm.person, updatedPerson);

        peopleRepo.save(vm.person).then(showSavedToast);
      });
    }

    function editEvent(field, $event) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/person/event-edit-dialog.html',
        locals: {
          // create a copy for manipulation
          event: angular.copy(vm.person[field])
        },
        controller: 'EventEditDialogController',
        controllerAs: 'vm'
      };

      var dialogPromise = $mdDialog.show(dialog);

      dialogPromise.then(function (updatedEvent) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        angular.extend(vm.person[field], updatedEvent);

        peopleRepo.save(vm.person).then(showSavedToast);
      });
    }

    function editSummary($event) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/components/summary-edit-dialog/summary-edit-dialog.html',
        locals: {
          // create a copy for manipulation (even if it is just a string)
          summary: angular.copy(vm.person.summary)
        },
        controller: 'SummaryEditDialogController',
        controllerAs: 'vm'
      };

      var dialogPromise = $mdDialog.show(dialog);

      dialogPromise.then(function (updatedSummary) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        vm.person.summary = updatedSummary;

        peopleRepo.save(vm.person).then(showSavedToast);
      });
    }

    function editBibliography($event) {
      citationEditDialog.show(vm.references, null, $event).then(function () {
        refsRepo.save(vm.references).then(showSavedToast);
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
        var message = nameLabel + ' has been deleted.';
        var toast = $mdToast.simple()
          .textContent(message)
          .position('bottom right');

        $state.go('editor');

        return $mdToast.show(toast);
      }

      function showErrorToast() {
        var toast = $mdToast.simple()
          .textContent('Unable to delete ' + nameLabel)
          .position('bottom right');

        return $mdToast.show(toast);
      }
    }

    function showSavedToast() {
      var toast = $mdToast.simple()
        .textContent('Saved')
        .position('bottom right');

      return $mdToast.show(toast);
    }
  }

})();
