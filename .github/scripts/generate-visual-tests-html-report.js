import { html, render } from '@lit-labs/ssr';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  BRANCH_NAME,
  VISUAL_TESTS_FINAL_REPORT_NAME,
  VISUAL_TESTS_REPORTS_DIR,
} from '../../web-test-runner/visual-tests/visual-tests-utils.js';

const { default: visualTestsFinalReport } = await import(
  `../../${VISUAL_TESTS_REPORTS_DIR}/${VISUAL_TESTS_FINAL_REPORT_NAME}`,
  {
    with: { type: 'json' },
  }
);

const htmlReportTemplate = html`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>PR ${process.env.PR_NUMBER} - Branch ${BRANCH_NAME} - Visual tests Report</title>
      <link rel="stylesheet" href="https://components.clever-cloud.com/styles.css" />
      ${unsafeHTML(`
          <script>
            window.toto = ${JSON.stringify(visualTestsFinalReport)};
          </script>
        `)}
      <style>
        html {
          margin: 0;
        }

        body {
          display: grid;
          grid-template-columns: min(20rem, 100%) 1fr;
          grid-template-rows: 1fr;
          padding: 0;
          margin: 0;
          font-family:
            'Nunito Sans', 'Segoe UI', 'Ubuntu', 'Cantarell', 'Noto Sans', 'Liberation Sans', Arial, sans-serif;
          height: 100svh;
        }

        .left,
        main {
          height: 100svh;
        }

        main {
          padding: 1rem;
          display: grid;
          grid-template-rows: max-content 1fr;
          gap: 2rem;
          box-sizing: border-box;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .storybook-link {
          text-decoration: none;
          display: block;
        }

        nav {
          overflow-y: auto;
          overflow-x: hidden;
          height: 100%;
        }

        .left {
          display: grid;
          grid-template-rows: auto auto 1fr;
          background-color: var(--cc-color-bg-neutral);
          border-right: solid 1px var(--cc-color-border-neutral-weak);
        }

        .left > header {
          display: grid;
          gap: 1rem;
          align-items: center;
          padding: 1.5rem 1rem;
          grid-template-columns: 2rem 1fr;
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

        cc-visual-changes-report-entry {
          min-height: 0;
          box-sizing: border-box;
        }

        .skip-link {
          position: absolute;
          top: 1rem;
          left: -9999px;
          background-color: #fff;
          padding: 1rem;
        }

        .skip-link:focus {
          left: 1rem;
        }
      </style>
      <script
        type="module"
        src="https://preview-components.clever-cloud.com/load.js?version=visual-changes-new-components&lang=en&components=cc-block,cc-block-section,cc-visual-changes-report-menu,cc-visual-changes-report-entry"
      ></script>
    </head>
    <body>
      <a class="skip-link" href="#main-content">Skip to content</a>
      <div class="left">
        <header>
          <a
            class="storybook-link"
            href="https://www.clever-cloud.com/doc/${process.env.REPOSITORY_NAME}/?path=/docs/readme--docs"
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
          <h1>Visual changes report</h1>
        </header>
        <nav aria-label="Visual changes tests results menu">
          <cc-visual-changes-report-menu></cc-visual-changes-report-menu>
        </nav>
      </div>
      <main id="main-content">
        <cc-block toggle="close">
          <h2 slot="header-title">Metadata</h2>
          <cc-block-section slot="content">
            <h3 slot="title">General info</h3>
            <dl class="feature-list">
              <div class="feature">
                <dt class="feature-name">PR Number:</dt>
                <dd class="feature-value">
                  <!-- TODO: repo url as env var (or repo.owner & repo.name) -->
                  <a
                    href="https://github.com/${process.env.REPOSITORY_OWNER}/${process.env
                      .REPOSITORY_NAME}/pulls/${visualTestsFinalReport.prNumber}"
                  >
                    ${visualTestsFinalReport.prNumber}
                  </a>
                </dd>
              </div>
              <div class="feature">
                <dt class="feature-name">Branch name:</dt>
                <dd class="feature-value">
                  <a
                    href="https://github.com/${process.env.REPOSITORY_OWNER}/${process.env
                      .REPOSITORY_NAME}/tree/${visualTestsFinalReport.branch}"
                  >
                    ${visualTestsFinalReport.branch}
                  </a>
                </dd>
              </div>
              <div class="feature">
                <dt class="feature-name">Workflow Id:</dt>
                <dd class="feature-value">
                  <a
                    href="https://github.com/${process.env.REPOSITORY_OWNER}/${process.env
                      .REPOSITORY_NAME}/actions/runs/${visualTestsFinalReport.workflowId}"
                  >
                    ${visualTestsFinalReport.workflowId}
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
                    href="https://github.com/${process.env.REPOSITORY_OWNER}/${process.env
                      .REPOSITORY_NAME}/commit/${visualTestsFinalReport.expectationMetadata.commitReference}"
                  >
                    ${visualTestsFinalReport.expectationMetadata.commitReference.slice(0, 7)}
                  </a>
                </dd>
              </div>
              <div class="feature">
                <dt class="feature-name">Last update:</dt>
                <dd class="feature-value">${visualTestsFinalReport.expectationMetadata.lastUpdated}</dd>
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
                    href="https://github.com/${process.env.REPOSITORY_OWNER}/${process.env
                      .REPOSITORY_NAME}/commit/${visualTestsFinalReport.actualMetadata.commitReference}"
                  >
                    ${visualTestsFinalReport.actualMetadata.commitReference.slice(0, 7)}
                  </a>
                </dd>
              </div>
              <div class="feature">
                <dt class="feature-name">Last update:</dt>
                <dd class="feature-value">${visualTestsFinalReport.actualMetadata.lastUpdated}</dd>
              </div>
            </dl>
          </cc-block-section>
        </cc-block>
        <cc-visual-changes-report-entry></cc-visual-changes-report-entry>
      </main>
      <script type="module">
        // TODO: rely on CDN
        // import('/src/components/cc-block/cc-block.js');
        // import('/src/components/cc-block/cc-block.js');
        // import('/src/components/cc-block-section/cc-block-section.js');
        // import('/src/components/cc-visual-changes-report-menu/cc-visual-changes-report-menu.js');
        // import('/src/components/cc-visual-changes-report-entry/cc-visual-changes-report-entry.js');
        // import(
        //   'https://preview-components.clever-cloud.com/load.js?version=visual-changes-new-components&lang=en&components=cc-block,cc-block-section,cc-visual-changes-report-menu,cc-visual-changes-report-entry'
        // );

        const entityDecoder = document.createElement('textarea');
        // TODO: should we sanitize just in case?!
        entityDecoder.innerHTML = document.getElementById('visual-changes-report').textContent;
        const decodedReport = entityDecoder.value;

        const report = JSON.parse(decodedReport);

        const ccVisualChangesReportEntry = document.querySelector('cc-visual-changes-report-entry');
        const ccVisualChangesReportMenu = document.querySelector('cc-visual-changes-report-menu');
        ccVisualChangesReportEntry.testResult = report.results[0];
        ccVisualChangesReportMenu.testResults = report.results;
        ccVisualChangesReportMenu.activeTestResultId = report.results[0].id;

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

            ccVisualChangesReportEntry.testResult = report.results.find(({ id }) => id === testResultId);
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
          const result = report.results.find(({ id }) => id === testResultId) ?? report.results[0];
          ccVisualChangesReportEntry.testResult = result;
        }
      </script>
      <script type="text/json" id="visual-changes-report">
        ${JSON.stringify(visualTestsFinalReport)}
      </script>
    </body>
  </html>
`;
const ssrResult = render(htmlReportTemplate);

mkdirSync(VISUAL_TESTS_REPORTS_DIR, { recursive: true });
writeFileSync(`${VISUAL_TESTS_REPORTS_DIR}/index.html`, collectResultSync(ssrResult), { encoding: 'utf-8' });
