import { html } from '@lit-labs/ssr';

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
        <script
          type="module"
          src="https://preview-components.clever-cloud.com/load.js?version=tests-visual-changes&lang=en&components=cc-visual-tests-report"
        ></script>
      </head>
      <body>
        <cc-visual-tests-report></cc-visual-tests-report>
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
