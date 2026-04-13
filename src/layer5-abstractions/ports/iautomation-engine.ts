import { EngineType } from './automation-engine-capabilities';

export interface IAutomationEngine {
  readonly engineType: EngineType;

  newPage(): Promise<void>;
  close(): Promise<void>;

  openUrl(url: string): Promise<void>;
  getTitle(): Promise<string>;

  click(selector: string): Promise<void>;
  enterText(selector: string, value: string): Promise<void>;
  hover(selector: string): Promise<void>;
  getTextContent(selector: string): Promise<string>;
  isVisible(selector: string): Promise<boolean>;

  waitForVisible(selector: string, timeoutMs?: number): Promise<void>;
  switchToFrame(frameSelector: string): Promise<void>;
  switchToWindow(windowRef: string): Promise<void>;

  startTrace(traceName?: string): Promise<void>;
  stopTrace(): Promise<string>;
  useDevtoolsProtocol(method: string, params?: Record<string, unknown>): Promise<unknown>;
}