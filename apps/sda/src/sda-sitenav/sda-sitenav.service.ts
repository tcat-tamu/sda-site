import * as angular from 'angular';

export interface INavProviderService {
  getLinks(): angular.IPromise<ILink[]>;
}

export interface ILink {
  url: string;
  label: string;
}

export class SdaSitenavProvider {
  url: string = '/navigation.json';

  /** @ngInject */
  $get($http: angular.IHttpService): INavProviderService {
    return {
      getLinks: () => $http.get(this.url).then(res => res.data)
    };
  }
}
