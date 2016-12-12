export class GoogleAnalyticsProvider {
  id: string;
  domain: string = 'auto';

  /** @ngInject */
  $get(ga: any) {
    if (!this.id) {
      throw new Error('No tracking ID set!');
    }

    ga('create', this.id, this.domain);

    return ga;
  }
}
