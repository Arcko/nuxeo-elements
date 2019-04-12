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
import { fixture, flush, html } from '@nuxeo/nuxeo-elements/test/test-helpers.js';
import '../nuxeo-slots.js';
/* eslint-disable no-unused-expressions */

// return all children excluding <nuxeo-slot>
function _content(slot) {
  return slot.parentElement.querySelectorAll(':not(nuxeo-slot)');
}

const makeSlot = (name) =>
  fixture(
    html`
      <nuxeo-slot slot="${name}"></nuxeo-slot>
    `,
  );

const makeContent = async (name, slot, content, options = {}) => {
  const { order, disabled, priority } = options;
  const tmpl = content
    ? html`
        <template
          >${content}</template
        >
      `
    : '';
  const slContent = html`
    <nuxeo-slot-content
      name="${name}"
      slot="${slot}"
      order="${order || 0}"
      ?disabled=${disabled}
      priority="${priority || 0}"
    >
      ${tmpl}
    </nuxeo-slot-content>
  `;
  const fx = await fixture(slContent);
  await flush();
  return fx;
};

suite('<nuxeo-slot>', () => {
  let slot1;
  let slot2;

  setup(async () => {
    slot1 = await makeSlot('SLOT1');
    slot2 = await makeSlot('SLOT2');
  });

  test('empty slots and content', async () => {
    expect(_content(slot1)).to.be.empty;

    await makeContent('empty', 'SLOT1');

    expect(_content(slot1)).to.be.empty;
  });

  test('slot content', async () => {
    await makeContent(
      'content1',
      'SLOT1',
      html`
        <span>Content 1</span>
      `,
      { order: 1 },
    );

    expect(_content(slot1).length).to.be.equal(1);
    expect(_content(slot2)).to.be.empty;

    await makeContent(
      'content2',
      'SLOT1',
      html`
        <span>Content 2</span>
      `,
      { order: 2 },
    );

    expect(_content(slot1).length).to.be.equal(2);
    expect(_content(slot2)).to.be.empty;

    await makeContent(
      'content3',
      'SLOT2',
      html`
        <span>Content 3</span>
      `,
    );

    expect(_content(slot1).length).to.be.equal(2);
    expect(_content(slot2).length).to.be.equal(1);

    const content1 = _content(slot1);
    const content2 = _content(slot2);
    expect(content1[0].textContent).to.be.equal('Content 1');
    expect(content1[1].textContent).to.be.equal('Content 2');
    expect(content2[0].textContent).to.be.equal('Content 3');
  });

  test('slot content order', async () => {
    await makeContent(
      'content2',
      'SLOT1',
      html`
        <span>Content 2</span>
      `,
      { order: 2 },
    );

    expect(_content(slot1).length).to.be.equal(1);

    await makeContent(
      'content1',
      'SLOT1',
      html`
        <span>Content 1</span>
      `,
      { order: 1 },
    );

    const content = _content(slot1);
    expect(content.length).to.be.equal(2);

    // check content 1 was moved to first
    expect(content[0].textContent).to.be.equal('Content 1');
  });

  test('slot content disabled', async () => {
    await makeContent(
      'content1',
      'SLOT1',
      html`
        <span>Content 1</span>
      `,
    );

    expect(_content(slot1).length).to.be.equal(1);

    await makeContent('content1', 'SLOT1', '', { disabled: true });

    expect(_content(slot1)).to.be.empty;
  });

  test('slot content re-enabled', async () => {
    await makeContent(
      'content',
      'SLOT1',
      html`
        <span>Disabled content</span>
      `,
      { disabled: true },
    );

    expect(_content(slot1)).to.be.empty;

    await makeContent('content', 'SLOT1');

    const content = _content(slot1);
    expect(content.length).to.be.equal(1);
    expect(content[0].textContent).to.be.equal('Disabled content');
  });

  test('slot content override', async () => {
    await makeContent(
      'content1',
      'SLOT1',
      html`
        <span>Content 1</span>
      `,
    );
    await makeContent(
      'content2',
      'SLOT1',
      html`
        <span>Content 2</span>
      `,
    );

    let content = _content(slot1);
    expect(content.length).to.be.equal(2);
    expect(content[0].textContent).to.be.equal('Content 1');

    await makeContent(
      'content1',
      'SLOT1',
      html`
        <span>Content 1 override</span>
      `,
      { order: 3 },
    );
    content = _content(slot1);
    expect(content.length).to.be.equal(2);

    // check content 1 was moved to last
    expect(content[1].textContent).to.be.equal('Content 1 override');
  });

  test('slot content priority', async () => {
    await makeContent(
      'content1',
      'SLOT1',
      html`
        <span>Content 1</span>
      `,
    );

    await makeContent(
      'content1',
      'SLOT1',
      html`
        <span>Content 1 override</span>
      `,
      { priority: 10 },
    );

    const content = _content(slot1);
    expect(content.length).to.be.equal(1);
    expect(content[0].textContent).to.be.equal('Content 1 override');
  });

  test('slot shared model', async () => {
    await makeContent(
      'content3',
      'SLOT1',
      html`
        <span>[[property]]</span>
      `,
    );

    window.nuxeo.slots.setSharedModel({ property: 'test1' });

    const content = _content(slot1);
    expect(content.length).to.be.equal(1);
    expect(content[0].textContent).to.be.equal('test1');
    window.nuxeo.slots.setSharedModel({ property: 'test2' });
    expect(content[0].textContent).to.be.equal('test2');
  });
});
