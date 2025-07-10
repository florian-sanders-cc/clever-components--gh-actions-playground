export interface VisualTestResult {
  id: string;
  componentTagName: string;
  storyName: string;
  viewportType: ViewportType;
  browserName: BrowserName;
  screenshots: VisualTestScreenshots;
}

export type BrowserName = 'chrome' | 'chromium' | 'firefox' | 'safari' | 'webkit';

export interface VisualTestScreenshots {
  expectationScreenshotUrl: string;
  diffScreenshotUrl: string;
  actualScreenshotUrl: string;
}

export type ViewportType = 'mobile' | 'desktop';
