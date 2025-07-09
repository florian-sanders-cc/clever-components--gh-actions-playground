import { mkdirSync, writeFileSync } from 'node:fs';
import { kebabCase } from '../../src/lib/change-case.js';
import { VISUAL_UPDATE_FLAG, getScreenshotUrl } from './visual-tests-utils.js';

/**
 * @typedef {import('@web/test-runner').Reporter} Reporter
 * @typedef {import('@web/test-runner').TestSuiteResult} TestSuiteResult
 * @typedef {import('./visual-tests-json-reporter.types.js').VisualTestResult} VisualTestResult
 * @typedef {import('./visual-tests-json-reporter.types.js').ViewportType} ViewportType
 */

/** @returns {Reporter} */
export function visualTestsJsonReporter() {
  return {
    onTestRunFinished({ sessions }) {
      if (process.argv.includes(VISUAL_UPDATE_FLAG)) {
        console.log('Expectation update detected: Skipping report');
        return;
      }

      /** @type {VisualTestResult[]} */
      const visualTestsResults = [];

      for (const { browser, testResults } of sessions) {
        const browserName = browser.name;
        for (const { name: componentTagName, suites: componentSuites } of testResults.suites) {
          for (const { name: storyName, suites: storySuites } of componentSuites) {
            for (const {
              name: viewportType,
              tests: [visualRegressionTest],
            } of /** @type {Array<TestSuiteResult & { name: ViewportType }>} */ (storySuites)) {
              if (visualRegressionTest == null || visualRegressionTest.passed) {
                continue;
              }

              const commonGetScreenshotUrlArgs = {
                browser: browserName,
                componentTagName,
                storyName,
                viewportType,
              };

              /** @type {VisualTestResult} */
              const visualTestResult = {
                id: kebabCase(`${componentTagName}-${storyName}-${viewportType}-${browserName}`),
                browserName,
                componentTagName,
                storyName,
                viewportType,
                screenshots: {
                  expectationScreenshotUrl: getScreenshotUrl({
                    ...commonGetScreenshotUrlArgs,
                    screenshotType: 'expectation',
                  }),
                  actualScreenshotUrl: getScreenshotUrl({
                    ...commonGetScreenshotUrlArgs,
                    screenshotType: 'actual',
                  }),
                  diffScreenshotUrl: getScreenshotUrl({
                    ...commonGetScreenshotUrlArgs,
                    screenshotType: 'diff',
                  }),
                },
              };
              visualTestsResults.push(visualTestResult);
            }
          }
        }
      }

      mkdirSync('test-reports', { recursive: true });
      writeFileSync(
        'test-reports/visual-tests-results.json',
        JSON.stringify({ results: visualTestsResults }, null, 2),
        'utf-8',
      );
      console.log('Generated visual tests report in "test-reports/visual-tests-results.json"');
    },
  };
}
