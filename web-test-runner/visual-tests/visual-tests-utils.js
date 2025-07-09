import { kebabCase } from '../../src/lib/change-case.js';
import { CELLAR_HOST } from '../../tasks/cellar-client.js';
import { getCurrentBranch } from '../../tasks/git-utils.js';

/**
 * @typedef {'expectation' | 'diff' | 'actual'} ScreenshotType
 */

export const VISUAL_TEST_CELLAR_BUCKET_NAME = 'clever-components-visual-tests';

export const VISUAL_UPDATE_FLAG = '--update-expectation';

const CURRENT_BRANCH_NAME = getCurrentBranch();

const BASE_SCREENSHOT_URL = new URL(
  `${CURRENT_BRANCH_NAME}`,
  `https://${VISUAL_TEST_CELLAR_BUCKET_NAME}.${CELLAR_HOST}`,
);

const EXTENSION = '.png';

/**
 * @param {object} _
 * @param {string} _.browser
 * @param {string} _.componentWithStoryName
 * @param {ScreenshotType} _.screenshotType
 * @returns {string}
 */
export function getScreenshotPath({ browser, componentWithStoryName, screenshotType }) {
  const filename = `${componentWithStoryName}-${screenshotType}`;
  const fullPath = `${CURRENT_BRANCH_NAME}/${browser}/${filename}`;
  const kebabCasePath = kebabCase(fullPath);

  return kebabCasePath + EXTENSION;
}

/**
 * Constructs a screenshot URL for a given browser, component, story, viewport, and screenshot type.
 *
 * @param {object} _ - The parameters for building the screenshot URL.
 * @param {string} _.browser - The name of the browser.
 * @param {string} _.componentTagName - The tag name of the component.
 * @param {string} _.storyName - The name of the story.
 * @param {'desktop'|'mobile'} _.viewportType - The type of viewport.
 * @param {ScreenshotType} _.screenshotType - The type of screenshot.
 * @returns {string|null} The constructed screenshot URL, or null if an error occurs.
 */
export function getScreenshotUrl({ browser, componentTagName, storyName, viewportType, screenshotType }) {
  const filename = `${componentTagName}-${storyName}-${viewportType}-${screenshotType}`;
  const relativePath = `/${browser}/${filename}`;
  const kebabCasePath = kebabCase(relativePath);

  return BASE_SCREENSHOT_URL.href + kebabCasePath + EXTENSION;
}
