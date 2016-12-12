(function () {
  'use strict';

  var EVT_ANIMATION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend ' +
    'webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionend';

  $.fn.extend({
    animateCss: function (animationName, cb) {
        this.addClass('animated ' + animationName).one(EVT_ANIMATION_END, function() {
            $(this).removeClass('animated ' + animationName);
            if (cb) {
              cb.call(this);
            }
        });
    }
  });

  // navigation toggle
  $('.nav-toggle').on('click', function (evt) {
    evt.preventDefault();
    $('#site-navigation').toggleClass('collapsed');
    $(this).toggleClass('active');
  });

  // footer toggle
  $('.footer-toggle').on('click', function (evt) {
    evt.preventDefault();
    $('#footer-content').slideToggle(200);

    var icon = $(this).find('i');
    var iconName = icon.text();

    if (iconName === 'arrow_drop_up') {
      icon.text('arrow_drop_down');
    } else {
      icon.text('arrow_drop_up');
    }
  });

  // collapsible navigation lists
  $('.nav-collapsible li').each(function () {
    var item = $(this);

    if (item.children('ol,ul').length === 0) {
      return;
    }

    var handle = $('<span>', { class: 'handle material-icons', text: item.children('ol,ul').is(':hidden') ? 'keyboard_arrow_right' : 'expand_more' }).on('click', function (evt) {
      evt.stopImmediatePropagation();
      item.toggleClass('expanded').children('ol,ul').slideToggle(200);
      $(this).text(($(this).text() === 'expand_more') ? 'keyboard_arrow_right' : 'expand_more');
    });

    item.prepend(handle);
  });

  $(window).on('resize', function () {
    $('.nav-collapsible li').each(function () {
      $(this).find('.handle')
        .text($(this).children('ol,ul').is(':hidden') ? 'keyboard_arrow_right' : 'expand_more');
    });
  });

})();
