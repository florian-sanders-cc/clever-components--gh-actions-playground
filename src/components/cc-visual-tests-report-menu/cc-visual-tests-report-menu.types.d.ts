import { VisualTestResult } from '../../../web-test-runner/visual-tests/visual-tests-json-reporter.types.js';

export type VisualTestsReportMenuViewportEntry = {
  viewportType: VisualTestResult['viewportType'];
  browserName: string;
  id: string;
};

export type VisualTestsReportMenuStoryEntry = {
  storyName: string;
  viewports: Array<VisualTestsReportMenuViewportEntry>;
};

export type VisualTestsReportMenuComponentEntry = {
  componentTagName: string;
  stories: Array<VisualTestsReportMenuStoryEntry>;
};

export type VisualTestsReportMenuEntries = Array<VisualTestsReportMenuComponentEntry>;
