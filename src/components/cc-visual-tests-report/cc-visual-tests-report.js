import { LitElement, css, html } from 'lit';
import { DateFormatter } from '../../lib/date/date-formatter.js';
import { generateDevHubHref } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-datetime-relative/cc-datetime-relative.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-visual-tests-report-entry/cc-visual-tests-report-entry.js';
import '../cc-visual-tests-report-menu/cc-visual-tests-report-menu.js';

const DATE_FORMATTER_SHORT = new DateFormatter('datetime-short', 'local');

/**
 * @typedef {import('./visual-tests-report.types.js').VisualTestsReport} VisualTestsReport
 */

export class CcVisualTestsReport extends LitElement {
  static get properties() {
    return {
      activeTestResultId: { type: String, attribute: 'active-test-result-id' },
      report: { type: Object },
    };
  }
  constructor() {
    super();

    /** @type {typeof this.report['results'][number]['id']} */
    this.activeTestResultId = null;

    /** @type {VisualTestsReport} */
    this.report = null;
  }

  render() {
    const { repositoryOwner, repositoryName, prNumber, workflowId, branchName, expectationMetadata, actualMetadata } =
      this.report;
    const activeTestResult =
      this.report.results.find((result) => result.id === this.activeTestResultId) ?? this.report.results[0];

    return html`
      <cc-link class="skip-link" href="#main-content">Skip to content</cc-link>
      <div class="left">
        <header>
          <a
            class="storybook-link"
            href="${generateDevHubHref('clever-components/?path=/docs/readme--docs')}"
            title="Clever Components - Storybook - new window"
            target="_blank"
            rel="noopener"
          >
            <cc-img
              src="https://assets.clever-cloud.com/login-assets/img/logo.svg"
              a11y-name="Clever Components - Storybook"
            ></cc-img>
          </a>
          <h1>Visual tests report</h1>
        </header>
        <nav aria-label="Visual tests report menu">
          <cc-visual-tests-report-menu
            .testResults="${this.report.results}"
            active-test-result-id="${activeTestResult.id}"
          ></cc-visual-tests-report-menu>
        </nav>
      </div>
      <main id="main-content">
        ${this._renderMetadata({
          repositoryOwner,
          repositoryName,
          prNumber,
          workflowId,
          branchName,
          expectationMetadata,
          actualMetadata,
        })}
        <cc-visual-tests-report-entry .testResult="${activeTestResult}"></cc-visual-tests-report-entry>
      </main>
    `;
  }

  /** @param {Omit<VisualTestsReport, 'results' | 'impactedComponents'>} _ */
  _renderMetadata({
    repositoryOwner,
    repositoryName,
    prNumber,
    workflowId,
    branchName,
    expectationMetadata,
    actualMetadata,
  }) {
    return html`
      <cc-block toggle="close">
        <h2 slot="header-title">Metadata</h2>
        <cc-block-section slot="content">
          <h3 slot="title">General info</h3>
          <dl class="metadata-list">
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">PR Number:</dt>
              <dd class="metadata-list__item__value">
                <cc-link href="https://github.com/${repositoryOwner}/${repositoryName}/pulls/${prNumber}">
                  <span class="visually-hidden">Access PR -</span>
                  ${prNumber}
                </cc-link>
              </dd>
            </div>
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">Branch name:</dt>
              <dd class="metadata-list__item__value">
                <cc-link href="https://github.com/${repositoryOwner}/${repositoryName}/tree/${branchName}">
                  <span class="visually-hidden">Access branch -</span>
                  ${branchName}
                </cc-link>
              </dd>
            </div>
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">Workflow Id:</dt>
              <dd class="metadata-list__item__value">
                <cc-link href="https://github.com/${repositoryOwner}/${repositoryName}/actions/runs/${workflowId}">
                  <span class="visually-hidden">Access workflow -</span>
                  ${workflowId}
                </cc-link>
              </dd>
            </div>
          </dl>
        </cc-block-section>
        <cc-block-section slot="content">
          <h3 slot="title">Expectation</h3>
          <dl class="metadata-list">
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">Commit sha:</dt>
              <dd class="metadata-list__item__value">
                <cc-link
                  href="https://github.com/${repositoryOwner}/${repositoryName}/commit/${expectationMetadata.commitReference}"
                >
                  <span class="visually-hidden">Access expectation commit -</span>
                  ${expectationMetadata.commitReference.slice(0, 7)}
                </cc-link>
              </dd>
            </div>
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">Last update:</dt>
              <dd class="metadata-list__item__value">
                <span>${DATE_FORMATTER_SHORT.format(new Date(expectationMetadata.lastUpdated))}</span>
                <span class="datetime">
                  | <cc-datetime-relative datetime="${expectationMetadata.lastUpdated}"></cc-datetime-relative>
                </span>
              </dd>
            </div>
          </dl>
        </cc-block-section>
        <cc-block-section slot="content">
          <h3 slot="title">Actual</h3>
          <dl class="metadata-list">
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">Commit sha:</dt>
              <dd class="metadata-list__item__value">
                <cc-link
                  href="https://github.com/${repositoryOwner}/${repositoryName}/commit/${actualMetadata.commitReference}"
                >
                  <span class="visually-hidden">Access actual commit -</span>
                  ${actualMetadata.commitReference.slice(0, 7)}
                </cc-link>
              </dd>
            </div>
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">Last update:</dt>
              <dd class="metadata-list__item__value">
                <span>${DATE_FORMATTER_SHORT.format(new Date(actualMetadata.lastUpdated))}</span>
                <span class="datetime">
                  | <cc-datetime-relative datetime="${actualMetadata.lastUpdated}"></cc-datetime-relative>
                </span>
              </dd>
            </div>
          </dl>
        </cc-block-section>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      css`
        :host {
          display: grid;
          grid-template-columns: min(20rem, 100%) 1fr;
          grid-template-rows: 1fr;
        }

        dl,
        dt,
        dd,
        h1,
        h2,
        h3,
        h4 {
          margin: 0;
          padding: 0;
        }

        .skip-link {
          background-color: #fff;
          left: -9999px;
          padding: 1rem;
          position: absolute;
          top: 1rem;
        }

        .skip-link:focus {
          left: 1rem;
        }

        .left,
        main {
          height: 100svh;
        }

        main {
          box-sizing: border-box;
          display: grid;
          gap: 2rem;
          grid-template-rows: max-content 1fr;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 1rem;
          scrollbar-gutter: stable;
        }

        .storybook-link {
          align-items: center;
          border-radius: var(--cc-border-radius-default);
          display: flex;
          text-decoration: none;
        }

        .storybook-link:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
        }

        .storybook-link cc-img {
          --cc-img-fit: contain;

          height: 2em;
          width: 2em;
        }

        nav {
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-gutter: stable;
        }

        .left {
          background-color: var(--cc-color-bg-neutral);
          border-right: solid 1px var(--cc-color-border-neutral-weak);
          display: grid;
          grid-template-rows: auto auto 1fr;
        }

        header {
          align-items: center;
          display: grid;
          gap: 1rem;
          grid-template-columns: 2rem 1fr;
          padding: 1.5rem 1rem;
        }

        h1 {
          font-size: 1.3rem;
        }

        .info-block-list {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .info {
          display: flex;
          gap: 0.5rem;
        }

        h3 {
          font-size: 1em;
        }

        cc-block-section {
          margin-top: 0;
          padding-top: 1em;
        }

        .metadata-list {
          --bdw: 2px;
          --color: var(--cc-color-bg-primary);
          --padding: 0.5em;

          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .metadata-list__item {
          background-color: var(--color);
          border: var(--bdw) solid var(--color);
          border-radius: var(--cc-border-radius-default);
          display: flex;
          flex-wrap: wrap;
          font-size: 0.8em;
        }

        .metadata-list__item__name,
        .metadata-list__item__value {
          box-sizing: border-box;
          flex: 1 1 auto;
          font-weight: bold;
          padding: calc(var(--padding) / 2) var(--padding);
          text-align: center;
        }

        .metadata-list__item__name {
          color: var(--cc-color-text-inverted, #fff);
        }

        .metadata-list__item__value {
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-small);
          color: var(--cc-color-text-primary);
        }

        .datetime {
          font-style: italic;
        }

        cc-visual-changes-report-entry {
          box-sizing: border-box;
          min-height: 0;
        }
      `,
    ];
  }
}

customElements.define('cc-visual-tests-report', CcVisualTestsReport);
