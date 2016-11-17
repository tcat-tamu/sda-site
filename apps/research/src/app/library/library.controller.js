(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .controller('LibraryController', LibraryController);

  /** @ngInject */
  function LibraryController($http, $mdSidenav, $mdToast, trcSearch) {
    var vm = this;

    vm.navigation = [];

    vm.search = search;
    vm.loading = false;
    vm.results = null;

    vm.startingPoints = [
      {
        author: "Spinoza",
        work: "Treatise Theological and Political",
        authorId: "9",
        workId: "64"
      }, {
        author: "Leslie",
        work: "A Short and Easy Method with the Deists",
        authorId: "12",
        workId: "47"
      }, {
        author: "Collins",
        work: "A Discourse of the Grounds and Reasons of the Christian Religion",
        authorId: "30",
        workId: "26"
      }, {
        author: "Sherlock",
        work: "The Trial of the Witnesses of the Resurrection",
        authorId: "6",
        workId: "400"
      }, {
        author: "Tindal",
        work: "Christianity as Old as the Creation",
        authorId: "3",
        workId: "68"
      }, {
        author: "Butler",
        work: "The Analogy of Religion",
        authorId: "13",
        workId: "13"
      }, {
        author: "Henry Dodwell Jr.",
        work: "Christianity Not Founded on Argument",
        authorId: "33",
        workId: "30"
      }, {
        author: "Hume",
        work: "Philosophical Essays",
        authorId: "5",
        workId: "2"
      }, {
        author: "Leland",
        work: "A View of the Principal Deistical Writers",
        authorId: "41",
        workId: "45"
      }, {
        author: "Campbell",
        work: "A Dissertation on Miracles",
        authorId: "4",
        workId: "4"
      }, {
        author: "Paley",
        work: "Horae Paulinae",
        authorId: "16",
        workId: "162"
      }, {
        author: "Paley",
        work: "A View of the Evidences of Christianity",
        authorId: "16",
        workId: "1267"
      }, {
        author: "Gibbon",
        work: "The Decline and Fall of the Roman Empire",
        authorId: "1142",
        workId: "1382"
      }, {
        author: "Paine",
        work: "The Age of Reason, Part 2",
        authorId: "77",
        workId: "1691"
      }, {
        author: "Watson",
        work: "An Apology for the Bible",
        authorId: "70",
        workId: "1474"
      }, {
        author: "Strauss",
        work: "The Life of Jesus, Critically Examined",
        authorId: "10",
        workId: "909"
      }, {
        author: "Whately",
        work: "Historic Doubts Relative to Napoleon Buonaparte",
        authorId: "68",
        workId: "1499"
      }, {
        author: "Blunt",
        work: "Undesigned Coincidences",
        authorId: "61",
        workId: "181"
      }, {
        author: "Temple, et al.",
        work: "Essays and Reviews",
        authorId: "",
        workId: "2002"
      }, {
        author: "Colenso",
        work: "The Pentateuch and the Book of Joshua Critically Examined",
        authorId: "1477",
        workId: "2007"
      }, {
        author: "Arnold",
        work: "Literature and Dogma",
        authorId: "1162",
        workId: "1711"
      }, {
        author: "Cassels",
        work: "Supernatural Religion",
        authorId: "1130",
        workId: "1789"
      }, {
        author: "Leathes",
        work: "Old Testament Prophecy",
        authorId: "522",
        workId: "765"
      }
    ];

    activate();

    function activate() {
      $http.get('/assets/data/navigation.json').then(function (res) {
        vm.navigation = res.data;
      });
    }

    function search(query) {
      vm.loading = true;
      vm.results = trcSearch.search(query);
      vm.results.$promise.then(function () {
        vm.loading = false;
      }, function () {
        vm.loading = false;
        vm.results = null;
        $mdToast.showSimple('Failed to load search results');
      });
    }
  }
})();
