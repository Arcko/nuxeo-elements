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
import '../widgets/nuxeo-collapsible.js';
import { html, fixture, flush, isElementVisible, waitChanged } from '../../testing-helpers';
import '../nuxeo-icons';
/* eslint-disable no-unused-expressions */

suite('nuxeo-collapsible', () => {
  suite('Collapse behaviour', () => {
    test('Should display nuxeo-collapsible when declaring the element', async () => {
      const nuxeoCollapsible = await fixture(
        html`
          <nuxeo-collapsible></nuxeo-collapsible>
        `,
      );
      await flush();

      expect(isElementVisible(nuxeoCollapsible.shadowRoot.querySelector('button'))).to.be.true;
    });

    test('Should show and hide content when toggle is activated', async () => {
      const nuxeoCollapsible = await fixture(
        html`
          <nuxeo-collapsible>
            <span slot="heading">Content</span>
            <div>Collapsed content</div>
          </nuxeo-collapsible>
        `,
      );
      await flush();

      const content = nuxeoCollapsible.shadowRoot.querySelectorAll('slot')[2].assignedNodes()[2];
      const ironCollapse = nuxeoCollapsible.shadowRoot.querySelector('iron-collapse');
      if (isElementVisible(content)) {
        await waitChanged(ironCollapse, 'aria-hidden');
      }
      expect(isElementVisible(content)).to.be.false;

      nuxeoCollapsible.expanded = true;
      if (!isElementVisible(content)) {
        await waitChanged(ironCollapse, 'aria-hidden');
      }
      expect(isElementVisible(content)).to.be.true;
      expect(content.innerHTML).to.equal('Collapsed content');
    });
  });

  suite('Properties', () => {
    test('Should display chevron position defaulted to the end when its position is not set', async () => {
      const nuxeoCollapsible = await fixture(
        html`
          <nuxeo-collapsible>
            <span class="heading" slot="heading">Content</span>
          </nuxeo-collapsible>
        `,
      );
      await flush();

      const heading = nuxeoCollapsible.shadowRoot.querySelectorAll('slot')[0];
      const chevron = nuxeoCollapsible.shadowRoot.querySelectorAll('slot')[1];
      expect(isElementVisible(chevron)).to.be.true;
      expect(heading.offsetLeft).to.equal(0);
      expect(chevron.offsetLeft).to.above(heading.offsetLeft);
    });

    test('Should display chevron at the beginning when its position is set to "start"', async () => {
      const nuxeoCollapsible = await fixture(
        html`
          <nuxeo-collapsible chevron-position="start">
            <span slot="heading">Content</span>
          </nuxeo-collapsible>
        `,
      );
      await flush();

      const heading = nuxeoCollapsible.shadowRoot.querySelector('slot').assignedNodes()[0];
      const chevron = nuxeoCollapsible.shadowRoot.querySelectorAll('slot')[1];
      expect(isElementVisible(chevron)).to.be.true;
      expect(heading.offsetLeft).to.equal(24);
      expect(chevron.offsetLeft).to.equal(4);
    });

    test('Should display a customized icon when an icon is set', async () => {
      const nuxeoCollapsible = await fixture(
        html`
          <nuxeo-collapsible>
            <span slot="heading">Content</span>
            <span slot="chevron">My icon</span>
          </nuxeo-collapsible>
        `,
      );
      await flush();

      const chevron = nuxeoCollapsible.shadowRoot.querySelectorAll('slot')[1].assignedNodes()[0];
      expect(isElementVisible(chevron)).to.be.true;
      expect(chevron.innerHTML).to.equal('My icon');
    });

    test('Should display heading when it is set', async () => {
      const nuxeoCollapsible = await fixture(
        html`
          <nuxeo-collapsible>
            <span class="heading" slot="heading">Content</span>
          </nuxeo-collapsible>
        `,
      );
      await flush();

      const heading = nuxeoCollapsible.shadowRoot.querySelector('slot').assignedElements()[0];
      expect(isElementVisible(heading)).to.be.true;
      expect(heading.innerHTML).to.equal('Content');
    });

    test('Should hide collapsed content when "expanded" is not set', async () => {
      const nuxeoCollapsible = await fixture(
        html`
          <nuxeo-collapsible>
            <span slot="heading">Content</span>
            <div>Collapsed content</div>
          </nuxeo-collapsible>
        `,
      );
      await flush();

      const content = nuxeoCollapsible.shadowRoot.querySelectorAll('slot')[2].assignedNodes()[2];
      expect(isElementVisible(content)).to.be.false;
      expect(content.innerHTML).to.equal('Collapsed content');
    });

    test('Should show collapsed content when "expanded" is set', async () => {
      const nuxeoCollapsible = await fixture(
        html`
          <nuxeo-collapsible expanded>
            <span slot="heading">Content</span>
            <div>Collapsed content</div>
          </nuxeo-collapsible>
        `,
      );
      await flush();

      const content = nuxeoCollapsible.shadowRoot.querySelectorAll('slot')[2].assignedNodes()[2];
      expect(isElementVisible(content)).to.be.true;
      expect(content.innerHTML).to.equal('Collapsed content');
    });
  });
});
