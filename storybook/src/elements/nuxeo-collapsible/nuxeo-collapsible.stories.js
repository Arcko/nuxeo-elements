import { html } from 'lit-html';
import { storiesOf } from '@storybook/polymer';
import { boolean, select, text } from '@storybook/addon-knobs';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-collapsible';

const stories = storiesOf('UI/nuxeo-collapsible', module);

stories
  .add('Default', () => {
    const heading = text('Heading', 'Nuxeo');
    const chevronPosition = select('Chevron position', { start: 'start', end: 'end' }, 'end');
    const animation = boolean('Animation', true);
    const expanded = boolean('Expanded', false);

    return html`
      <style>
        :root {
          display: block;
          width: 300px;
          margin: 2rem;
        }

        .heading {
          font-weight: bold;
        }

        p {
          margin: 0;
        }
      </style>
      <nuxeo-collapsible .chevronPosition="${chevronPosition}" ?animation="${animation}" ?expanded="${expanded}">
        <span class="heading" slot="heading">${heading}</span>
        <p>Build Smarter Solutions for Today's Content Challenges</p>
      </nuxeo-collapsible>
    `;
  })

  .add('Nested collapsible', () => {
    const heading = text('Heading', 'Nuxeo');
    const chevronPosition = select('Chevron position', { start: 'start', end: 'end' }, 'end');
    const animation = boolean('Animation', true);
    const expanded = boolean('Expanded', false);

    return html`
      <style>
        :root {
          display: block;
          width: 300px;
          margin: 2rem;
        }

        nuxeo-collapsible {
          --nuxeo-collapsible-heading-padding: 0px;
        }

        .heading {
          font-weight: bold;
        }
      </style>
      <nuxeo-collapsible .chevronPosition="${chevronPosition}" ?animation="${animation}" ?expanded="${expanded}">
        <span class="heading" slot="heading">${heading}</span>
        <p>Build Smarter Solutions for Today's Content Challenges</p>
        <nuxeo-collapsible onclick="this.show=true">
          <span slot="heading"><a href="javascript:void(0);">Details</a></span>
          <span slot="chevron"></span>
          <p>
            Nuxeo makes it easy to build smart content applications that enhance customer experiences, improve decision
            making, and accelerate products to market.
          </p>
        </nuxeo-collapsible>
      </nuxeo-collapsible>
    `;
  });
