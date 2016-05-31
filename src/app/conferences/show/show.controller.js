(function () {
   'use strict';

   angular
      .module('sda.conference')
      .controller('ConferenceShowController', ConferenceShowController);

   /** @ngInject */
   function ConferenceShowController(moment) {
      var vm = this;

      // HACK: should be obtained from service or something
      vm.scrollOffset = 64;
      vm.keynotes = [];

      activate();

      function activate() {
         vm.keynotes = getKeynotes();
      }

      function getKeynotes() {
         return [
            {
               date: moment('2014-07-13'),
               segments: [
                  {
                     time: moment('2014-07-13T16:30:00'),
                     events: [
                        {
                           image: 'assets/images/avatars/default.jpg',
                           link: '',
                           title: '"Special Divine Action: The State of the Art and the Uses of History"',
                           speaker: 'Timothy McGrew'
                        }
                     ]
                  },
                  {
                     time: moment('2014-07-13T20:00:00'),
                     events: [
                        {
                           image: 'assets/images/avatars/default.jpg',
                           link: '',
                           title: '"The Historian and the Miraculous"',
                           speaker: 'Graham Twelftree'
                        }
                     ]
                  }
               ]
            },
            {
               date: moment('2014-07-14'),
               segments: [
                  {
                     time: moment('2014-07-14T16:30:00'),
                     events: [
                        {
                           image: 'assets/images/avatars/default.jpg',
                           link: '',
                           title: '"Special Divine Action: The State of the Art and the Uses of History"',
                           speaker: 'Timothy McGrew'
                        }
                     ]
                  },
                  {
                     time: moment('2014-07-14T20:00:00'),
                     events: [
                        {
                           image: 'assets/images/avatars/default.jpg',
                           link: '',
                           title: '"The Historian and the Miraculous"',
                           speaker: 'Graham Twelftree'
                        }
                     ]
                  }
               ]
            }
         ];
      }
   }

})();
