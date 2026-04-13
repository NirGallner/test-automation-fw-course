import { createUnsupportedCapabilityError } from '../../../support/exception-manager';
import { IAutomationEngine } from '../../ports/iautomation-engine';

/**
 * Stub adapter that satisfies the `IAutomationEngine` contract for the Selenium
 * engine. All methods throw `createUnsupportedCapabilityError` until a
 * real Selenium integration is provided. The stub exists so that capability-
 * parity contracts can verify which methods are expected but not yet wired.
 */
export class SeleniumBrowserAdapter implements IAutomationEngine {
  public readonly engineType = 'selenium' as const;

  /**
   * Returns a new `SeleniumBrowserAdapter` instance without launching a real
   * browser; all methods on the returned instance throw unsupported errors.
   */
  public static async launch(): Promise<SeleniumBrowserAdapter> {
    return new SeleniumBrowserAdapter();
  }

  public async newPage(): Promise<void> {
    throw createUnsupportedCapabilityError('newPage', 'Selenium');
  }

  public async close(): Promise<void> {
    return;
  }

  public async openUrl(_url: string): Promise<void> {
    throw createUnsupportedCapabilityError('openUrl', 'Selenium');
  }

  public async getTitle(): Promise<string> {
    throw createUnsupportedCapabilityError('getTitle', 'Selenium');
  }

  public async click(_selector: string): Promise<void> {
    throw createUnsupportedCapabilityError('click', 'Selenium');
  }

  public async enterText(_selector: string, _value: string): Promise<void> {
    throw createUnsupportedCapabilityError('enterText', 'Selenium');
  }

  public async hover(_selector: string): Promise<void> {
    throw createUnsupportedCapabilityError('hover', 'Selenium');
  }

  public async getTextContent(_selector: string): Promise<string> {
    throw createUnsupportedCapabilityError('getTextContent', 'Selenium');
  }

  public async isVisible(_selector: string): Promise<boolean> {
    throw createUnsupportedCapabilityError('isVisible', 'Selenium');
  }

  public async waitForVisible(_selector: string, _timeoutMs = 5000): Promise<void> {
    throw createUnsupportedCapabilityError('waitForVisible', 'Selenium');
  }

  public async switchToFrame(_frameSelector: string): Promise<void> {
    throw createUnsupportedCapabilityError('switchToFrame', 'Selenium');
  }

  public async switchToWindow(_windowRef: string): Promise<void> {
    throw createUnsupportedCapabilityError('switchToWindow', 'Selenium');
  }

  public async startTrace(_traceName?: string): Promise<void> {
    throw createUnsupportedCapabilityError('startTrace', 'Selenium');
  }

  public async stopTrace(): Promise<string> {
    throw createUnsupportedCapabilityError('stopTrace', 'Selenium');
  }

  public async useDevtoolsProtocol(_method: string, _params?: Record<string, unknown>): Promise<unknown> {
    throw createUnsupportedCapabilityError('useDevtoolsProtocol', 'Selenium');
  }
}