import { visualTestsResults } from '../../stories/fixtures/visual-tests-results.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-visual-tests-report-entry.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Utility/<cc-visual-tests-report-entry>',
  component: 'cc-visual-tests-report-entry',
};

const conf = {
  component: 'cc-visual-tests-report-entry',
  css: `
    :host {
      max-width: 100% !important;
      height: 100vh;
    }

    cc-visual-tests-report-entry {
      height: 100%;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      testResult: visualTestsResults[0],
    },
  ],
});

export const comparison = makeStory(conf, {
  items: [
    {
      testResult: visualTestsResults[0],
      viewerMode: 'comparison',
    },
  ],
});

export const diff = makeStory(conf, {
  items: [
    {
      testResult: visualTestsResults[0],
      viewerMode: 'diff',
    },
  ],
});
