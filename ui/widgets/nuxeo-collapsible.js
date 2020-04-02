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
import '@polymer/iron-collapse/iron-collapse.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@nuxeo/nuxeo-elements/nuxeo-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

{
  /**
   * An element for creating a collapsible block of content.
   * It comes with a default chevron that can be displayed at the end (default) or at the beggining of the heading.
   * The heading can be expanded by default.
   * The chevron has its own slot so it can be also customized.
   * It is also possible to disable the default animation.
   *
   * Example:
   *
   *     <nuxeo-collapsible expanded chevronPosition="start">
   *        <label slot="heading">Nuxeo</label>
   *        <div>Collapsed content</div>
   *     </nuxeo-collapsible>
   *
   * ### Styling
   * The following custom properties and mixins are available for styling:
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--nuxeo-collapsible-heading-padding` | Heading padding | `4px`
   * `--nuxeo-collapsible-icon-height` | Chevron height | `20px`
   * `--nuxeo-collapsible-icon-width` | Chevron width | `20px`
   *
   * @memberof Nuxeo
   *
   */

  class Collapsible extends Nuxeo.Element {
    static get template() {
      return html`
        <style>
          .toggle {
            --iron-icon-height: var(--nuxeo-collapsible-icon-height, 20px);
            --iron-icon-width: var(--nuxeo-collapsible-icon-width, 20px);
          }

          button {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0;
            padding: var(--nuxeo-collapsible-heading-padding, 4px);
            background: transparent;
            border: none;
            cursor: pointer;
            text-decoration: none;
            font-size: 1rem;
          }

          .heading {
            width: calc(100% - var(--nuxeo-collapsible-icon-width, 20px));
            overflow-x: hidden;
            text-align: start;
          }

          .chevron {
            height: var(--nuxeo-collapsible-icon-height, 20px);
            width: var(--nuxeo-collapsible-icon-width, 20px);
            display: block;
          }

          .start {
            flex-direction: row-reverse;
            justify-content: flex-end;
          }

          iron-collapse {
            padding: 0 var(--nuxeo-collapsible-heading-padding, 4px);
          }
        </style>

        <button aria-expanded="[[expanded]]" on-tap="_toggle" class$="[[chevronPosition]]">
          <slot class="heading" name="heading"></slot>
          <slot class="chevron" name="chevron">
            <iron-icon class="toggle" icon="[[_toggleIcon(expanded)]]" toggle></iron-icon>
          </slot>
        </button>
        <iron-collapse opened="[[expanded]]" no-animation="[[!animation]]">
          <slot></slot>
        </iron-collapse>
      `;
    }

    static get is() {
      return 'nuxeo-collapsible';
    }

    static get properties() {
      return {
        /**
         * Set animation to false to disable animations
         */
        animation: {
          type: Boolean,
          value: true,
        },

        /**
         * Chevron icon position on start or end of the button
         */
        chevronPosition: {
          type: String,
          value: 'end',
        },

        /**
         * Expended or collapsed by default
         */
        expanded: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },
      };
    }

    _toggle() {
      this.expanded = !this.expanded;
    }

    _toggleIcon(expanded) {
      return `hardware:keyboard-arrow-${expanded ? 'up' : 'down'}`;
    }
  }

  customElements.define(Collapsible.is, Collapsible);
  Nuxeo.Collapsible = Collapsible;
}
