import { render } from '@lit-labs/ssr';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { visualTestsHtmlReport } from './visual-tests-html-report-template.js';

import {
  VISUAL_TESTS_FINAL_REPORT_NAME,
  VISUAL_TESTS_REPORTS_DIR,
} from '../../web-test-runner/visual-tests/visual-tests-utils.js';

const { default: visualTestsFinalReport } = await import(
  `../../${VISUAL_TESTS_REPORTS_DIR}/${VISUAL_TESTS_FINAL_REPORT_NAME}`,
  {
    with: { type: 'json' },
  }
);

const ssrResult = render(visualTestsHtmlReport(visualTestsFinalReport));

mkdirSync(VISUAL_TESTS_REPORTS_DIR, { recursive: true });
writeFileSync(`${VISUAL_TESTS_REPORTS_DIR}/index.html`, collectResultSync(ssrResult), { encoding: 'utf-8' });
