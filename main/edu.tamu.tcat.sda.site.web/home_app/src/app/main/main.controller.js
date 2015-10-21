(function () {
   'use strict';

   angular
      .module('sda.site')
      .controller('MainController', MainController);

   /** @ngInject */
   function MainController($timeout) {
      var vm = this;

      vm.slides = [];
      vm.advisors = [];
      vm.recentNews = [];
      vm.callForProposals = [];
      vm.isSearchFormVisible = false;
      vm.toggleSearchForm = toggleSearchForm;

      activate();

      function activate() {
         vm.slides = getSlides();
         vm.advisors = getAdvisors();
         vm.recentNews = getRecentNews();
         vm.callForProposals = getCallForProposals();
      }

      function toggleSearchForm() {
         vm.isSearchFormVisible = !vm.isSearchFormVisible;
         $timeout(function () {
            // HACK: give element time to display before focusing
            angular.element('input#search').focus();
         }, 100);
      }

      function getCallForProposals() {
         return [
            {
               title: 'Course development grants to integrate topics on Special Divine Action.'
            },
            {
               title: 'Research grants available to support focused study groups.'
            },
            {
               title: 'Coming Soon. CFP for SDA 2015. Science and Personal Action: Human and Divine.'
            }
         ];
      }

      function getRecentNews() {
         return [
            {
               title: 'SDA Project Technology Presented',
               description: 'Dr. Neal Audenaert presents at ASIS&T and INKE-ID.'
            }
         ];
      }

      function getAdvisors() {
         return [
            {
               name: 'Craig Keener',
               position: 'Professor of New Testament, Asbury Theological Seminary'
            },
            {
               name: 'Lenn Goodman',
               position: 'Professor of Philosophy and Andrew W. Mellon Professor in the Humanities, Vanderbilt University'
            },
            {
               name: 'Peter Harrison',
               position: 'Research Professor and Director of the Centre for the History of European Discourses, Queensland University'
            },
            {
               name: 'Christine Madsen',
               position: 'Head of Digital Programmes, Bodleian Libraries, Oxford University'
            },
            {
               name: 'Timothy Mawson',
               position: 'Fellow and Tutor in Philosophy, Oxford University'
            },
            {
               name: 'Richard Swinburne',
               position: 'Nolloth Professor Emeritus of the Philosophy of the Christian Religion, Oxford University'
            },
            {
               name: 'Raymond Tallis',
               position: 'Professor Emeritus, Manchester University and St. George\'s Hospital Medical School'
            },
            {
               name: 'Graham Twelftree',
               position: 'Charles L. Holman Professor of New Testament and Early Christianity, Regent University'
            },
            {
               name: 'Johannes Zachhuber',
               position: 'Chair, Theology and Religion Faculty, Oxford University'
            }
         ];

      }

      function getSlides() {
         var doesGodAct = {
            banner: {
               image: 'slider-female.jpg',
               style: 'basic-title right',
               content: '<h2>Does God Act?</h2>' +
                  '<p class="subtitle">Explore one of the most profound<br/> influences on ideas, culture and civilisation</p>'
            },

            video: {
               url: 'https://youtu.be/HmSKMbq7Fk8',
               label: 'Introducing the Project',
               length: '3:40'
            },

            leadin: 'Is every action in the cosmos only an effect of some other action in the cosmos? Or is there something more? Is there divine action?',
            content: 'One fact is certain: belief in these special divine actions has had an immense impact on human society and civilisation. Such beliefs shape, often decisively, the way we think about the world, what we do in the world, and what we hope for now and in the future.',
            more: {
               url: 'about/overview.html',
               label: 'Read More'
            }
         };

         var digitalLibrary = {
            banner: {
               image: 'slider-books.jpg',
               style: 'upper-box textbg-copper',
               content: '<h2>Digital Library</h2>' +
                  '<p class="subtitle">Discover the landscape of insights and influences that shape our understanding</p>'
            },

            video: {
               url: 'https://youtu.be/EMjg86wlGU0',
               label: 'The State of the Art and the Uses of History',
               length: '31:48'
            },

            leadin: 'What do centuries of scholarship teach about special divine action in relation to our philosophical, religious, and scientific worldviews?',
            content: 'The Special Divine Action Project assists scholars by providing access to digital versions  of key works,  topical essays, biographies and tools to explore the influences, provocations and convergences among these works in science, philosophy, theology and religion.',
            more: {
               url: 'about/digitallibrary.html',
               label: 'Read More'
            }
         };

         var support = {
            banner: {
               image: 'slider-earth.jpg',
               style: 'upper-box textbg-copper',
               content: '<h2>Student and Teacher Support</h2>' +
                  '<p class="subtitle">Apply study aids, competitions and course materials to universities, colleges, and schools</p>'
            },

            video: {
               url: 'https://youtu.be/-AJfNBuOIpY',
               label: 'The Historian and the Miraculous',
               length: '1:16:36'
            },

            leadin: 'How can I study, teach or research the questions, perspectives and debates about special divine action in my school, college or university?',
            content: 'The Special Divine Action Project supports study and teaching in universities, colleges, and schools, providing introductions, biographies, reviews, reading lists, audio-visual materials, course materials, course development and cluster group competitions.',
            more: {
               url: 'about/digitallibrary.html',
               label: 'Read More'
            }
         };

         var conferences = {
            banner: {
               image: 'slider-radcliffe.jpg',
               style: 'upper-box',
               content: '<h2>Conferences and Publications</h2>' +
                  '<p class="subtitle">Benefit from opportunities to learn present and debate new research</p>'
            },

            video: {
               url: 'https://youtu.be/TXqhB_RqEzI',
               label: 'Cultural and Theological Resistance',
               length: '1:12:31'
            },

            leadin: 'What research is being done by academics today on special divine action? How can I contribute or engage with such work?',
            content: 'Research activities of the Special Divine Action Project include conferences with leading academics worldwide, competitively selected short papers, opportunities for debates and discussion, and keynote videos online together with a range of academic publications.'
         };

         var engagement = {
            banner: {
               image: 'slider-people.jpg',
               style: 'upper-box textbg-copper',
               content: '<h2>Public Engagement</h2>' +
                  '<p class="subtitle">Enjoy introductions to the themes and questions of special divine action</p>'
            },

            video: {
               url: 'https://youtu.be/waxSBeqbzOI',
               label: 'God\'s Work in Nature',
               length: '1:22:39'
            },

            leadin: 'How can I benefit from this project in daily life? How can I explore the ideas and questions regarding special divine action in the world?',
            content: 'The Special Divine Action Project provides summaries of key ideas for general use by members of the public supported by audiovisual materials and animations. All academic tools and research of the project are also made available via the web for use worldwide.',
            more: {
               url: 'about/public_engagement.html',
               label: 'Read More'
            }
         };

         return [
            doesGodAct,
            digitalLibrary,
            support,
            conferences,
            engagement
         ];
      }

   }

})();
