/**
@license
(C) Copyright Nuxeo Corp. (http://nuxeo.com/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import '@polymer/polymer/polymer-legacy.js';

/**
 * `Nuxeo.RoutingBehavior` provides a `urlFor` helper function for reverse routing.
 *
 * @polymerBehavior Nuxeo.RoutingBehavior
 */
export const RoutingBehavior = {
  properties: {
    router: {
      type: Object,
      observer: '_routerChanged',
      value() {
        return RoutingBehavior.__router;
      },
    },
    urlFor: {
      type: Function,
      computed: '_computeUrlFor(router)',
    },
    navigateTo: {
      type: Function,
      computed: '_computeNavigateTo(router)',
    },
  },

  attached() {
    // initialize router
    this._updateRouter();

    this.routerChangedHandler = this._updateRouter.bind(this);

    document.addEventListener('nuxeo-router-changed', this.routerChangedHandler);
  },

  detached() {
    document.removeEventListener('nuxeo-router-changed', this.routerChangedHandler);
  },

  _updateRouter() {
    this.router = this.router || RoutingBehavior.__router;
  },

  // Caches the router
  _routerChanged(router) {
    if (router && !RoutingBehavior.__router) {
      RoutingBehavior.__router = router;
      document.dispatchEvent(new Event('nuxeo-router-changed'));
    }
  },

  /**
   * Returns a computed `urlFor` method, based on the current `router`.
   */
  _computeUrlFor() {
    return function(...args) {
      if (this.router) {
        const route = args[0];
        const baseUrl = this.router.baseUrl || '';
        if (route.startsWith('/')) {
          return baseUrl + route;
        }
        if (!this.router[route]) {
          console.error(`Could not generate a url for route ${route}`);
          return;
        }
        const params = Array.prototype.slice.call(args, 1);
        return (
          baseUrl +
          (baseUrl.endsWith('/') ? '' : '/') +
          (this.router.useHashbang ? '#!' : '') +
          this.router[route].apply(this, params)
        );
      }
    };
  },

  /**
   * Returns a computed `navigateTo` method, based on the current `router`.
   * Invokes `router.navigate` to trigger the actual navigation.
   */
  _computeNavigateTo() {
    return function(...args) {
      if (this.router) {
        const route = args[0];
        const baseUrl = this.router.baseUrl || '';
        if (route.startsWith('/')) {
          this.router.navigate(baseUrl + route);
        }
        if (!this.router[route]) {
          console.error(`Could not navigate to a url for route ${route}`);
        }
        const params = Array.prototype.slice.call(args, 1);
        this.router.navigate(this.router[route].apply(this, params));
      } else {
        console.error('No router defined');
      }
    };
  },
};
