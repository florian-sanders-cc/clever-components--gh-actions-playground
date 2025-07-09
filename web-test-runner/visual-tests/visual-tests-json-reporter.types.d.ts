export interface VisualTestResult {
  id: string;
  componentTagName: string;
  storyName: string;
  viewportType: ViewportType;
  browserName: string;
  screenshots: VisualTestScreenshots;
}

export interface VisualTestScreenshots {
  expectationScreenshotUrl: string;
  diffScreenshotUrl: string;
  actualScreenshotUrl: string;
}

export type ViewportType = 'mobile' | 'desktop';
