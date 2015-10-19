(function () {
   'use strict';

   angular
      .module('sda.site')
      .directive('billboard', billboard);

   /** @ngInject */
   function billboard($window) {
      var directive = {
         restrict: 'E',
         templateUrl: 'app/components/billboard/billboard.html',
         transclude: true,
         replace: true,
         link: linkFunc,
         scope: {},
         controller: BillboardController,
         bindToController: true,
         controllerAs: 'vm'
      };

      return directive;

      function linkFunc(scope, el) {
         function fixHeight(el) {
            var maxHeight = 0,
               slides = el.find('.slides'),
               data = el.data('flexslider');

            slides.children()
               .height('auto')
               .each(function() {
                  maxHeight = Math.max(maxHeight, $(this).height());
               })
               .height(maxHeight);

            slides.height(maxHeight);
            if (data) {
               data.h = maxHeight;
            }
         }

         fixHeight($('#banners'));
         $(window).on('resize', function() {
            fixHeight($('#banners'));
         });
      }

      /** @ngInject */
      function BillboardController() {
         var vm = this;

         vm.slides = getSlides();
         vm.slides[0].active = true;
         vm.addSlide = addSlide;
         vm.setActive = setActive;
         vm.nextSlide = nextSlide;
         vm.prevSlide = prevSlide;

         function setActive(slide) {
            vm.slides.forEach(function (s) {
               s.active = false;
            });

            slide.active = true;
         }

         function nextSlide() {
            var currentIndex = vm.slides.findIndex(function (slide) {
               return slide.active;
            });

            var nextIndex = (currentIndex + 1) % vm.slides.length;
            setActive(vm.slides[nextIndex]);
         }

         function prevSlide() {
            var currentIndex = vm.slides.findIndex(function (slide) {
               return slide.active;
            });

            var prevIndex = (currentIndex + vm.slides.length - 1) % vm.slides.length;
            setActive(vm.slides[prevIndex]);
         }

         function addSlide(slide) {
            if (vm.slides.length === 0) {
               setActive(slide);
            }

            vm.slides.push(slide);
         }



         function getSlides() {
            var doesGodAct = {
               banner: {
                  image: 'slider-female.jpg',
                  style: 'basic-title right',
                  content: '<h2>Does God Act?</h2>' +
                     '<p class="subtitle">Explore one of the most profound<br/> influences on ideas, culture and civilisation</p>'
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
   }

}());
