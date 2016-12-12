(function () {
  'use strict';

  var fullpage = $('main.fullpage-scroll').fullpage({
    scrollOverflow: true,
    sectionSelector: '.fullpage-scroll-section',
    slideSelector: '.fullpage-scroll-slide',
    paddingTop: '4rem' // HACK
  });

  $('.scroll-indicator').on('click', function (evt) {
    evt.preventDefault();
    $.fn.fullpage.moveSectionDown();
  });

  $('iframe[data-src]').each(function () {
    var embed = $(this);
    embed.parents('.modal')
      .on('show.bs.modal', function (evt) {
        embed.attr('src', embed.data('src'));
      })
      .on('hide.bs.modal', function (evt) {
        embed.attr('src', '');
      });
  });

  billboard($('.billboard'));

  nav($('.main-nav'));

  function billboard(el) {
    var currentTrigger = null;

    // hide ui elements
    hideElements();

    // navigation controls
    var navItems = el.find('.control-nav .control-nav-trigger');

    navItems.on('click', function (evt) {
      evt.preventDefault();
      activateSlide($(this));
    });

    el.find('.prev').on('click', function (evt) {
      evt.preventDefault();
      activatePrevSlide();
    });

    el.find('.next').on('click', function (evt) {
      evt.preventDefault();
      activateNextSlide();
    });

    // activate first element
    activateSlide(navItems.first());

    function activatePrevSlide() {
      var prevTrigger = currentTrigger.parent().prev().children().first();
      if (prevTrigger.length === 0) {
        prevTrigger = navItems.last();
      }
      activateSlide(prevTrigger);
    }

    function activateNextSlide() {
      var nextTrigger = currentTrigger.parent().next().children().first();
      if (nextTrigger.length === 0) {
        nextTrigger = navItems.first();
      }
      activateSlide(nextTrigger);
    }

    function activateSlide(trigger) {
      navItems.removeClass('active');
      trigger.addClass('active');

      hideElements();
      showElements(trigger.data('index'));

      currentTrigger = trigger;
    }

    function hideElements() {
      el.find('.banner').hide(); // can be faked with .addClass('ng-hide'), but only sets element opacity.
      el.find('.play-video').hide();
      el.find('.slide').hide();
    }

    function showElements(index) {
      el.find('.banner-' + index).show();
      el.find('.play-video-' + index).show();
      el.find('.slide-' + index).show();
    }
  }

  function nav(el) {
    el.find('.panel-set').hide();
    el.find('.module').hide();

    el.find('.buckets .bucket a').on('click', goToTab);
    el.find('.modules .module .controls a').on('click', goToTab);

    // activate first module / sections
    el.find('.buckets .bucket a').first().each(function () {
      activate($(this).attr('href'));
      var parent = $(this).parent();
      parent.siblings().removeClass('active');
      parent.addClass('active');
    });

    el.find('.modules .module').each(function () {
      $(this).find('.controls a').first().each(function () {
        activate($(this).attr('href'));
        var parent = $(this).parent();
        parent.siblings().removeClass('active');
        parent.addClass('active');
      });
    });

    function goToTab(evt) {
      evt.preventDefault();
      activate($(this).attr('href'));
      var parent = $(this).parent();
      parent.siblings().removeClass('active');
      parent.addClass('active');
    }

    function activate(target) {
      $(target).siblings().hide();
      $(target).show();
    }
  }
})();
