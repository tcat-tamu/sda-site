import * as $ from 'jquery';

// easing fn from http://gsgd.co.uk/sandbox/jquery/easing/
(<any>$).easing.easeInOutCubic = function (x: number, t: number, b: number, c: number, d: number): number {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t + b;
  }

  return c / 2 * ((t -= 2) * t * t + 2) + b;
};

export function slideToggle() {
  return {
    beforeAddClass(element: JQuery, className: string, done: Function) {
      if (className === 'ng-hide') {
        element.slideUp(250, 'easeInOutCubic', done);
      }
    },

    removeClass(element: JQuery, className: string, done: Function) {
      if (className === 'ng-hide') {
        element.hide().slideDown(250, 'easeInOutCubic', done);
      }
    }
  };

}
