import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixArrowDownSLine as iconArrowDown,
  iconRemixArrowLeftSLine as iconArrowLeft,
  iconRemixArrowRightSLine as iconArrowRight,
} from '../../assets/cc-remix.icons.js';
import { camelCaseToSpacedCapitalized, kebabCase } from '../../lib/change-case.js';
import { enhanceStoryName } from '../../stories/lib/story-names.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('../cc-visual-tests-report/visual-tests-report.types.js').VisualTestResult} VisualTestResult
 * @typedef {import('./cc-visual-tests-report-menu.types.js').VisualTestsReportMenuEntries} VisualTestsReportMenuEntries
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLAnchorElement>} HTMLAnchorEvent
 * @typedef {import('lit').PropertyValues<CcVisualTestsReportMenu>} CcVisualChangesReportMenuPropertyValues
 */

export class CcVisualTestsReportMenu extends LitElement {
  static get properties() {
    return {
      activeTestResultId: { type: String, attribute: 'active-test-result-id' },
      testResults: { type: Array, attribute: 'test-results' },
      _activeMenuEntry: { type: Object, state: true },
      _menuEntries: { type: Array, state: true },
      _sortedTestResults: { type: Array, state: true },
      _sortedTestResultsIds: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {VisualTestResult['id']} */
    this.activeTestResultId = null;

    /** @type {VisualTestResult[]} */
    this.testResults = [];

    /** @type {{ component: string, story: string }} */
    this._activeMenuEntry = { component: null, story: null };

    /** @type {VisualTestsReportMenuEntries}  */
    this._menuEntries = [];

    /** @type {VisualTestResult[]} */
    this._sortedTestResults = [];

    /** @type {Array<VisualTestResult['id']>} */
    this._sortedTestResultsIds = [];
  }

  /**
   * Builds a hierarchical menu structure from the test results.
   *
   * @param {VisualTestResult[]} results
   * @returns {VisualTestsReportMenuEntries}
   */
  _getMenuEntries(results) {
    /** @type {VisualTestsReportMenuEntries} */
    const menuEntries = [];
    let currentComponent = null;
    let currentStory = null;

    for (const result of results) {
      if (currentComponent == null || currentComponent.componentTagName !== result.componentTagName) {
        currentComponent = {
          componentTagName: result.componentTagName,
          stories: [],
        };
        menuEntries.push(currentComponent);
      }

      if (currentStory == null || currentStory.storyName !== result.storyName) {
        currentStory = {
          storyName: result.storyName,
          viewports: [],
        };
        currentComponent.stories.push(currentStory);
      }

      currentStory.viewports.push({
        viewportType: result.viewportType,
        browserName: result.browserName,
        id: result.id,
      });
    }
    return menuEntries;
  }

  /** @param {string} componentTagName */
  _toggleComponent(componentTagName) {
    const isAlreadyActive = this._activeMenuEntry.component === componentTagName;
    this._activeMenuEntry = { component: isAlreadyActive ? null : componentTagName, story: null };
  }

  /** @param {string} kebabCasedStoryName */
  _toggleStory(kebabCasedStoryName) {
    const isAlreadyActive = this._activeMenuEntry.story === kebabCasedStoryName;
    this._activeMenuEntry = { ...this._activeMenuEntry, story: isAlreadyActive ? null : kebabCasedStoryName };
  }

  /** @param {CcVisualChangesReportMenuPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('testResults') && this.testResults.length > 0) {
      this._sortedTestResults = this._sortTestResults(this.testResults);

      this._sortedTestResultsIds = this._sortedTestResults.map(({ id }) => id);

      this._menuEntries = this._getMenuEntries(this._sortedTestResults);
    }

    if (changedProperties.has('activeTestResultId') || changedProperties.has('testResults')) {
      const activeTestResult = this.testResults.find((testResult) => this.activeTestResultId === testResult.id);
      if (activeTestResult != null) {
        this._activeMenuEntry = {
          component: activeTestResult.componentTagName,
          story: kebabCase(activeTestResult.storyName),
        };
      }

      this._setPreviousAndNextTestResultIds();
    }
  }

  /**
   * @param {VisualTestResult[]} testResults
   * @returns {VisualTestResult[]}
   */
  _sortTestResults(testResults) {
    return [...testResults].sort((a, b) => {
      const componentCompare = a.componentTagName.localeCompare(b.componentTagName);
      if (componentCompare !== 0) {
        return componentCompare;
      }
      // If componentTagNames are the same, sort by storyName
      if (a.storyName === 'defaultStory' && b.storyName !== 'defaultStory') {
        return -1;
      }
      if (a.storyName !== 'defaultStory' && b.storyName === 'defaultStory') {
        return 1;
      }
      const storyCompare = a.storyName.localeCompare(b.storyName);
      if (storyCompare !== 0) {
        return storyCompare;
      }
      // If storyNames are the same, sort by viewportType
      const browserNameCompare = a.browserName.localeCompare(b.browserName);
      if (browserNameCompare !== 0) {
        return browserNameCompare;
      }
      // If viewportTypes are the same, sort by browserName
      return a.viewportType.localeCompare(b.viewportType);
    });
  }

  _setPreviousAndNextTestResultIds() {
    const activeTestResultIndex = this._sortedTestResultsIds.indexOf(this.activeTestResultId);
    const nbOfTestResults = this._sortedTestResultsIds.length;
    const previousTestResultIndex = (activeTestResultIndex - 1 + nbOfTestResults) % nbOfTestResults;
    const nextTestResultIndex = (activeTestResultIndex + 1) % nbOfTestResults;

    this._previousTestResultId = this._sortedTestResultsIds[previousTestResultIndex];
    this._nextTestResultId = this._sortedTestResultsIds[nextTestResultIndex];
  }

  render() {
    if (this.testResults.length === 0) {
      return '';
    }

    return html`
      <ul class="quick-nav">
        <li>
          <a href="/test-result/${this._previousTestResultId}">
            <cc-icon .icon="${iconArrowLeft}"></cc-icon>
            <span>Previous</span>
          </a>
        </li>
        <li>
          <a href="/test-result/${this._nextTestResultId}">
            <span>Next</span>
            <cc-icon .icon="${iconArrowRight}"></cc-icon>
          </a>
        </li>
      </ul>
      <ul class="component-list">
        ${this._menuEntries.map(({ componentTagName, stories }) => {
          const isMenuItemOpen = this._activeMenuEntry.component === componentTagName;
          return html`
            <li class="component-list__item">
              <button
                class="component-list__item__btn btn"
                @click="${() => this._toggleComponent(componentTagName)}"
                aria-expanded="${isMenuItemOpen}"
                aria-controls="stories-${componentTagName}"
              >
                <cc-icon .icon="${iconArrowDown}"></cc-icon>
                <span>${componentTagName}</span>
              </button>
              <ul id="stories-${componentTagName}" class="story-list" ?hidden="${!isMenuItemOpen}">
                ${stories.map(({ storyName, viewports }) =>
                  this._renderStoryLevelEntries({ componentTagName, storyName, viewports }),
                )}
              </ul>
            </li>
          `;
        })}
      </ul>
    `;
  }

  /**
   * @param {object} _
   * @param {string} _.componentTagName
   * @param {string} _.storyName
   * @param {Pick<VisualTestResult, 'viewportType' | 'browserName' | 'id'>[]} _.viewports
   *  */
  _renderStoryLevelEntries({ componentTagName, storyName, viewports }) {
    const kebabCasedStoryName = kebabCase(storyName);
    const isMenuItemOpen = this._activeMenuEntry.story === kebabCasedStoryName;
    const storyNameToDisplay = enhanceStoryName(camelCaseToSpacedCapitalized(storyName));

    return html`
      <li class="story-list__item">
        <button
          class="story-list__item__btn btn"
          @click="${() => this._toggleStory(kebabCasedStoryName)}"
          aria-expanded="${isMenuItemOpen}"
          aria-controls="${componentTagName}-${kebabCasedStoryName}"
        >
          <cc-icon .icon="${iconArrowDown}"></cc-icon>
          <span>${storyNameToDisplay}</span>
        </button>
        <ul id="${componentTagName}-${kebabCasedStoryName}" class="viewport-browser-list" ?hidden="${!isMenuItemOpen}">
          ${viewports.map(
            ({ viewportType, browserName, id }) => html`
              <li class="viewport-browser-list__item">
                <a
                  class="viewport-browser-list__item__link ${classMap({
                    'viewport-browser-list__item__link--active': this.activeTestResultId === id,
                  })}"
                  href="?testResultId=${id}"
                >
                  <span>${viewportType} - ${browserName}</span>
                  <cc-icon .icon="${iconArrowRight}"></cc-icon>
                </a>
              </li>
            `,
          )}
        </ul>
      </li>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        cc-icon {
          flex: 0 0 auto;
        }

        ul,
        li {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .quick-nav {
          display: flex;
          gap: 1em;
          padding: 1em;
        }

        .quick-nav li {
          flex: 1 1 0;
        }

        .quick-nav a {
          align-items: center;
          background-color: var(--cc-color-bg-primary);
          border-radius: var(--cc-border-radius-default);
          color: var(--cc-color-text-inverted);
          display: flex;
          flex: 1 1 0;
          gap: 0.5em;
          justify-content: space-between;
          padding: 0.5em 1em;
          text-decoration: none;
        }

        .btn {
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          font: inherit;
          gap: 0.5em;
          padding: 0.2em 0.5em;
          text-align: start;
          width: 100%;
        }

        .btn cc-icon {
          transition: transform 0.3s;
        }

        .btn[aria-expanded='true'] cc-icon {
          transform: rotate(180deg);
        }

        .btn:hover cc-icon {
          transform: rotate(90deg);
        }

        .viewport-browser-list__item__link:focus-visible,
        .btn:focus-visible,
        .quick-nav a:focus {
          border-radius: var(--cc-border-radius-default);
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
        }

        .component-list {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .component-list__item {
          transition: background-color 0.3s;
        }

        .component-list__item__btn {
          padding: 1em;
        }

        .story-list:not([hidden]) {
          background-color: var(--cc-color-bg-neutral-alt);
          display: flex;
          flex-direction: column;
          padding: 0.5em 1em;
          transition: background-color 0.3s;
        }

        .story-list__item {
          padding: 0.5em;
        }

        .story-list__item:not(:last-of-type) {
          border-bottom: solid 1px var(--cc-color-border-neutral);
        }

        .viewport-browser-list {
          padding: 0.5em 0;
        }

        .viewport-browser-list__item__link {
          align-items: center;
          color: var(--cc-color-text-default);
          display: flex;
          justify-content: space-between;
          margin-left: 1.5em;
          padding: 0.5em;
          text-decoration: none;
          text-transform: capitalize;
        }

        .viewport-browser-list__item__link:hover {
          text-decoration: underline;
        }

        .viewport-browser-list__item__link--active {
          background-color: var(--cc-color-bg-primary);
          border-radius: var(--cc-border-radius-small);
          color: var(--cc-color-text-inverted);
        }
      `,
    ];
  }
}

customElements.define('cc-visual-tests-report-menu', CcVisualTestsReportMenu);
