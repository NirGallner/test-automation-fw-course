import { describe, expect, it } from 'vitest';
import { PlaywrightBrowserAdapter } from '../../src/layer5-abstractions/adapter/playwright/playwright-browser.adapter';
import { SeleniumBrowserAdapter } from '../../src/layer5-abstractions/adapter/selenium/selenium-browser.adapter';
import { VibiumBrowserAdapter } from '../../src/layer5-abstractions/adapter/vibium/vibium-browser.adapter';
import { IAutomationEngine } from '../../src/layer5-abstractions/ports/iautomation-engine';

describe('automation port contract', () => {
  it('playwright and vibium adapters expose shared intent methods', () => {
    const sharedMethods: Array<keyof IAutomationEngine> = [
      'newPage',
      'close',
      'openUrl',
      'getTitle',
      'click',
      'enterText',
      'hover',
      'getTextContent',
      'isVisible',
      'waitForVisible',
      'switchToFrame',
      'switchToWindow'
    ];

    for (const method of sharedMethods) {
      expect(typeof PlaywrightBrowserAdapter.prototype[method]).toBe('function');
      expect(typeof VibiumBrowserAdapter.prototype[method]).toBe('function');
    }
  });

  it('returns standardized unsupported messages for non-supported unique capabilities', async () => {
    const vibium = Object.create(VibiumBrowserAdapter.prototype) as VibiumBrowserAdapter;
    const selenium = await SeleniumBrowserAdapter.launch();

    await expect(vibium.startTrace('trace')).rejects.toThrow(
      'startTrace is not supported by the Vibium engine.'
    );
    await expect(selenium.useDevtoolsProtocol('Network.enable')).rejects.toThrow(
      'useDevtoolsProtocol is not supported by the Selenium engine.'
    );
  });
});
