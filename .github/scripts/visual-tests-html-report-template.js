/* eslint-disable lit/prefer-static-styles */
import { html } from '@lit-labs/ssr';
import { css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { generateDevHubHref } from '../../src/lib/utils.js';

/**
 * @typedef {import('./visual-tests-types.js').VisualTestsReport} VisualTestsReport
 */

/** @param {VisualTestsReport} report */
export function visualTestsHtmlReport(report) {
  const { repositoryOwner, repositoryName, prNumber, workflowId, branchName, expectationMetadata, actualMetadata } =
    report;
  return html`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>PR ${prNumber} - Branch ${branchName} - Visual tests Report</title>
        <link rel="stylesheet" href="https://components.clever-cloud.com/styles.css" />
        <style>
          ${unsafeHTML(styles.toString())}
        </style>
        <script
          type="module"
          src="https://preview-components.clever-cloud.com/load.js?version=visual-changes-new-components&amp;lang=en&amp;components=cc-block,cc-block-section,cc-visual-tests-menu,cc-visual-tests-entry"
        ></script>
      </head>
      <body>
        <a class="skip-link" href="#main-content">Skip to content</a>
        <div class="left">
          <header>
            <a
              class="storybook-link"
              href="${generateDevHubHref('clever-components/?path=/docs/readme--docs')}"
              title="Clever Components - Storybook - new window"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://assets.clever-cloud.com/login-assets/img/logo.svg"
                alt="Clever Components - Storybook"
                width="200"
              />
            </a>
            <h1>Visual tests report</h1>
          </header>
          <nav aria-label="Visual tests report menu">
            <cc-visual-tests-menu></cc-visual-tests-menu>
          </nav>
        </div>
        <main id="main-content">
          ${metadataTemplate({
            repositoryOwner,
            repositoryName,
            prNumber,
            workflowId,
            branchName,
            expectationMetadata,
            actualMetadata,
          })}
          <cc-visual-tests-entry></cc-visual-tests-entry>
        </main>
        <script type="module">
          const entityDecoder = document.createElement('textarea');
          // TODO: should we sanitize just in case?!
          entityDecoder.innerHTML = document.getElementById('visual-tests').textContent;
          const decodedReport = entityDecoder.value;

          const report = JSON.parse(decodedReport);

          const ccVisualChangesReportEntry = document.querySelector('cc-visual-tests-entry');
          const ccVisualChangesReportMenu = document.querySelector('cc-visual-tests-menu');
          ccVisualChangesReportEntry.testResult = results[0];
          ccVisualChangesReportMenu.testResults = results;
          ccVisualChangesReportMenu.activeTestResultId = results[0].id;

          if (window.location.search.length > 0) {
            const currentLocationUrl = new URL(window.location);
            navigateTo(currentLocationUrl.searchParams.get('testResultId'));
          }

          document.addEventListener('click', (e) => {
            const linkElement = e.composedPath().find((element) => element.tagName === 'A');

            if (
              linkElement != null &&
              linkElement.origin === window.location.origin &&
              linkElement.pathname.startsWith('/test-result/')
            ) {
              e.preventDefault();
              const testResultId = linkElement.pathname.split('/').pop();

              ccVisualChangesReportEntry.testResult = results.find(({ id }) => id === testResultId);
              ccVisualChangesReportMenu.activeTestResultId = testResultId;
              const url = new URL(window.location);
              url.searchParams.set('testResultId', testResultId);
              window.history.pushState({ testResultId }, '', url);
            }
          });

          window.addEventListener('popstate', (event) => {
            let testResultId;
            if (event.state && event.state.testResultId) {
              testResultId = event.state.testResultId;
            } else {
              testResultId = window.location.pathname.split('/').pop();
            }
            navigateTo(testResultId);
          });

          function navigateTo(testResultId) {
            const result = results.find(({ id }) => id === testResultId) ?? results[0];
            ccVisualChangesReportEntry.testResult = result;
          }
        </script>
        <script type="application/json" id="visual-tests-report">
          ${JSON.stringify(report)}
        </script>
      </body>
    </html>
  `;
}

/** @param {Omit<VisualTestsReport, 'results'>} _ */
function metadataTemplate({
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
        <dl class="feature-list">
          <div class="feature">
            <dt class="feature-name">PR Number:</dt>
            <dd class="feature-value">
              <a href="https://github.com/${repositoryOwner}/${repositoryName}/pulls/${prNumber}"> ${prNumber} </a>
            </dd>
          </div>
          <div class="feature">
            <dt class="feature-name">Branch name:</dt>
            <dd class="feature-value">
              <a href="https://github.com/${repositoryOwner}/${repositoryName}/tree/${branchName}"> ${branchName} </a>
            </dd>
          </div>
          <div class="feature">
            <dt class="feature-name">Workflow Id:</dt>
            <dd class="feature-value">
              <a href="https://github.com/${repositoryOwner}/${repositoryName}/actions/runs/${workflowId}">
                ${workflowId}
              </a>
            </dd>
          </div>
        </dl>
      </cc-block-section>
      <cc-block-section slot="content">
        <h3 slot="title">Baseline</h3>
        <dl class="feature-list">
          <div class="feature">
            <dt class="feature-name">Commit sha:</dt>
            <dd class="feature-value">
              <a
                href="https://github.com/${repositoryOwner}/${repositoryName}/commit/${expectationMetadata.commitReference}"
              >
                ${expectationMetadata.commitReference.slice(0, 7)}
              </a>
            </dd>
          </div>
          <div class="feature">
            <dt class="feature-name">Last update:</dt>
            <dd class="feature-value">${expectationMetadata.lastUpdated}</dd>
          </div>
        </dl>
      </cc-block-section>
      <cc-block-section slot="content">
        <h3 slot="title">Changes</h3>
        <dl class="feature-list">
          <div class="feature">
            <dt class="feature-name">Commit sha:</dt>
            <dd class="feature-value">
              <a
                href="https://github.com/${repositoryOwner}/${repositoryName}/commit/${actualMetadata.commitReference}"
              >
                ${actualMetadata.commitReference.slice(0, 7)}
              </a>
            </dd>
          </div>
          <div class="feature">
            <dt class="feature-name">Last update:</dt>
            <dd class="feature-value">${actualMetadata.lastUpdated}</dd>
          </div>
        </dl>
      </cc-block-section>
    </cc-block>
  `;
}

const styles = css`
  html {
    margin: 0;
  }

  body {
    display: grid;
    font-family: 'Nunito Sans', 'Segoe UI', 'Ubuntu', 'Cantarell', 'Noto Sans', 'Liberation Sans', 'Arial', sans-serif;
    grid-template-columns: min(20rem, 100%) 1fr;
    grid-template-rows: 1fr;
    height: 100svh;
    margin: 0;
    padding: 0;
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
  }

  .storybook-link {
    display: block;
    text-decoration: none;
  }

  nav {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .left {
    background-color: var(--cc-color-bg-neutral);
    border-right: solid 1px var(--cc-color-border-neutral-weak);
    display: grid;
    grid-template-rows: auto auto 1fr;
  }

  .left > header {
    align-items: center;
    display: grid;
    gap: 1rem;
    grid-template-columns: 2rem 1fr;
    padding: 1.5rem 1rem;
  }

  .left > header img {
    width: 100%;
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

  .feature-list {
    --bdw: 2px;
    --color: var(--cc-color-bg-primary);
    --padding: 0.6em;

    display: flex;
    flex-wrap: wrap;
    gap: 1em;
  }

  .feature {
    background-color: var(--color);
    border: var(--bdw) solid var(--color);
    border-radius: calc(2 * var(--bdw));
    display: flex;
    flex-wrap: wrap;
  }

  .feature-icon {
    align-items: center;
    display: inline-flex;
    margin-inline-start: var(--padding);
    width: 1.3em;
  }

  .feature-icon_img {
    --cc-icon-color: var(--cc-color-text-inverted);
  }

  .feature-name,
  .feature-value {
    box-sizing: border-box;
    flex: 1 1 auto;
    font-weight: bold;
    padding: calc(var(--padding) / 2) var(--padding);
    text-align: center;
  }

  .feature-name {
    color: var(--cc-color-text-inverted, #fff);
  }

  .feature-value {
    background-color: var(--cc-color-bg-default, #fff);
    border-radius: var(--bdw);
    color: var(--color);
  }

  cc-visual-tests-entry {
    box-sizing: border-box;
    min-height: 0;
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
`;
