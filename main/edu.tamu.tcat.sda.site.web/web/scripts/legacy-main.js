define(function(require) {

   require('plugins');
   var $ = require('jquery');


   // main navigation
   $(function () {
      $('.section--resources .buckets a').on('click', function (evt) {
         evt.preventDefault();

         $(this).parent().addClass('active')
            .siblings().removeClass('active');

         $($(this).attr('href'))
            .addClass('active')
            .siblings().removeClass('active');
      });

      $('.section--resources .modules .controls a').on('click', function (evt) {
         evt.preventDefault();

         $(this).parent().addClass('active')
            .siblings().removeClass('active');

         $($(this).attr('href'))
            .addClass('active')
            .siblings().removeClass('active');
      });
   });






   // legacy code

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

   function initBanners()
   {
      // Home -- Sliders (Introduction)
      var sliderIndex;
      $('#intro-text').flexslider({
         controlNav: false,
         directionNav: false,
         slideshow: false,
         touch: false
      });

      $('#banners').flexslider({
         controlNav: false,
         directionNav: false,
         slideshow: false,
         touch: false,
         start: function(slider) {
            while (slider.count) {
               $('#sda-paging').prepend('<li><a>' + slider.count + '</a></li>');
               --slider.count;
            }
            $('#slider-controls .flex-control-paging a').eq(slider.currentSlide).addClass('flex-active');
         },
         after: function(slider) {
            $('#slider-controls .flex-control-paging a.flex-active').removeClass('flex-active');
            $('#slider-controls .flex-control-paging a').eq(slider.currentSlide).addClass('flex-active');
         }
      });

      // listen to slider paging controls (i.e. nav dots)
      $('body').delegate('#slider-controls .flex-control-paging a', 'click', function(e) {
         sliderIndex = $(this).parent().index();
         $('#banners').flexslider(sliderIndex);
         $('#intro-text').flexslider(sliderIndex);
         e.preventDefault();
      });

      // listen to prev/next buttons
      $('#slider-controls .flex-direction-nav .flex-prev').on('click', function(e) {
         $('#banners').flexslider('prev');
         $('#intro-text').flexslider('prev');
         $('#slider-controls .flex-control-paging a.flex-active').removeClass('flex-active');
         e.preventDefault();
      });

      $('#slider-controls .flex-direction-nav .flex-next').on('click', function(e) {
         $('#banners').flexslider('next');
         $('#intro-text').flexslider('next');
         $('#slider-controls .flex-control-paging a.flex-active').removeClass('flex-active');
         e.preventDefault();
      });

      $('#modules').flexslider({
      		directionNav: false,
      		manualControls: '.bucket',
      		selector: '.module',
      		slideshow: false,
      		touch: false
      	});
        
      	$('#intro-text').flexslider({
      		controlNav: false,
      		directionNav: false,
      		slideshow: false,
      		touch: false,
      	});

      // HACK: Fixing the height of the banner slider to be the height of the tallest slide
      fixHeight($('#banners'));
      // $(window).load(function() {
      //    fixHeight($('#banners'));
      // });
      $(window).resize(function() {
         fixHeight($('#banners'));
      });
   }

   function onPageLoad()
   {
      initBanners();
   }

   // Pagelinks
   $('.pagelink').on('click', function(event) {
      $('html,body').animate({scrollTop: $(this.hash).offset().top}, 800);
      event.preventDefault();
   });

   // Home - Signup for Email Updates (Mobile)
   $('#signup-trigger').on('click', function() {
      $('#search').slideToggle();
   });
   // Home -- Our Advisory Board (View Our Advisors)
   $('#reveal-advisors').on('click', function(e) {
      $(this).remove();
      $('#advisors').slideToggle();
      e.preventDefault();
   });
   // Home - About the Project (View More)
   $('#more-trigger').on('click', function(e) {
      $(this).remove();
      $('#content--more').slideDown();
      e.preventDefault(e);
   });

   // Modal Windows
   $('#privacy-link').magnificPopup({
      type: 'inline'
   });
   $('#send-button').magnificPopup({
      items: {
         src: '#email-confirmation',
         type: 'inline'
      },
      callbacks: {
         beforeOpen: function() {
            var pendingText = "<h2>Just a moment&hellip;</h2><p>We're processing your request.</p>";
            var successText = "<h2>Thank You!</h2><p>You have successfully signed up to receive email updates about Special Divine Action.</p>";
            var badArgumentText = "<h2>Things don't look right.</h2><p>That doesn't look like an email address to us.</p>";
            var internalErrorText = "<h2>Well, this is embarassing.</h2><p>We seem to be having problems with email signup.</p>";
            var displayEl = $("#email-confirmation .msg");

            displayEl.html(pendingText);
            $.ajax({
               type: $('form.signup-form').attr('method'),
               url: $('form.signup-form').attr('action'),
               data: {
                  email: $('#email-signup').val()
               },
               success: function() {
                  displayEl.html(successText);
               },
               error: function() {
                  displayEl.html(internalErrorText);
               }
            });
         }
      }
   });
   $('#play-video').magnificPopup({
      type: 'iframe'
   });

   // Accordion
   $('.acc-trigger').on('click', function() {
      if (window.matchMedia('(max-width: 60em)').matches) {
         $(this).toggleClass('active');
         $(this).next('.acc-segment').slideToggle();
      }

   });

   // Table of Contents
   // 	$("#table-of-contents").stick_in_parent();
     //
   // 	// View More Buttons
   // 	  $('.view-more').on('click', function(e) {
   // 	    $(this).hide();
   // 	    $($(this).attr('href')).slideDown();
   // 	    e.preventDefault();
   // 	  });
   $(document).ready(onPageLoad);
});
