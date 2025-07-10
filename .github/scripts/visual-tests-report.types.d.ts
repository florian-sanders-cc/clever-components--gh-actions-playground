import { VisualTestResult } from '../../web-test-runner/visual-tests/visual-tests-json-reporter.types.js';

interface VisualTestsReport {
  expectationMetadata: {
    commitReference: string;
    lastUpdated: string;
  };
  actualMetadata: {
    commitReference: string;
    lastUpdated: string;
  };
  workflowId: string;
  prNumber: string;
  branchName: string;
  repositoryName: string;
  repositoryOwner: string;
  impactedComponents: Array<HTMLElement['tagName']>;
  results: VisualTestResult[];
}
