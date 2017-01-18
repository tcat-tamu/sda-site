import * as angular from 'angular';

/** @ngInject */
export function factory(worksRepo) {
  return workTitleFilter;

  /**
   * Formats a title object into a title: subtitle sttring
   *
   * @param {Title} title
   * @return {string}
   */
  function workTitleFilter(title) {
    if (angular.isArray(title)) {
      title = worksRepo.getTitle(title);
    }

    if (!title) {
      return '';
    }

    return title.title + (title.title && title.subtitle ? ': ' : '') + title.subtitle
  }
};
