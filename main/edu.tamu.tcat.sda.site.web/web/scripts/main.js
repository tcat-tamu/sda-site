function fixHeight(el) {
    var maxHeight = 0,
        slides = $('#banners').find('.slides'),
        data = $('#banners').data('flexslider');
    
    slides.children()
        .height('auto')
        .each(function() {
          	maxHeight = Math.max(maxHeight, $(this).height());
        })
        .height(maxHeight);
    slides.height(maxHeight);
    data && (data.h = maxHeight);
}

$(document).ready(function() {
	// Home -- Sliders (Introduction)
	var sliderIndex;
	$('#intro-text').flexslider({
		controlNav: false,
		directionNav: false,
		slideshow: false,
		touch: false,
	});
	
	$('#banners').flexslider({
		controlNav: false,
		directionNav: false,
		slideshow: false,
		touch: false,
		start: function(slider) {
			while(slider.count) {
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

	// HACK: Fixing the height of the banner slider to be the height of the tallest slide
	fixHeight();
	$(window).load(function() {
		fixHeight();
	});
	$(window).resize(function() {
		fixHeight();
	});

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
  	}
});
$('#play-video').magnificPopup({
      type: 'iframe'
});

// Accordion
$('.acc-trigger').on('click', function() {
	if (window.matchMedia("(max-width: 60em)").matches) {
		$(this).toggleClass('active');
		$(this).next('.acc-segment').slideToggle();
	} 
	else {
		
	}
	
});
