import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlaywrightBrowserAdapter } from '../../src/layer5-abstractions/adapter/playwright/playwright-browser.adapter';
import { SeleniumBrowserAdapter } from '../../src/layer5-abstractions/adapter/selenium/selenium-browser.adapter';
import { VibiumBrowserAdapter } from '../../src/layer5-abstractions/adapter/vibium/vibium-browser.adapter';
import { DriverRegistry } from '../../src/support/driver-registry';
import { resolveDriverEngine, resolveRuntimeConfig } from '../../src/support/runtime-config';

afterEach(async () => {
  delete process.env.DRIVER_ENGINE;
  await DriverRegistry.closeAutomationEngine();
  vi.restoreAllMocks();
});

describe('driver parity selection', () => {
  it('defaults to playwright when no driver is provided', async () => {
    delete process.env.DRIVER_ENGINE;
    expect(resolveRuntimeConfig().driverEngine).toBe('playwright');
    expect(DriverRegistry.getSelectedEngine()).toBe('playwright');
    await expect(DriverRegistry.closeAutomationEngine()).resolves.toBeUndefined();
  });

  it('supports vibium through runtime configuration', () => {
    process.env.DRIVER_ENGINE = 'vibium';
    expect(resolveRuntimeConfig().driverEngine).toBe('vibium');
    expect(resolveDriverEngine('VIBIUM')).toBe('vibium');
  });

  it('supports selenium selection through runtime configuration', () => {
    process.env.DRIVER_ENGINE = 'selenium';
    expect(resolveRuntimeConfig().driverEngine).toBe('selenium');
  });

  it('fails fast for unknown engine values', () => {
    process.env.DRIVER_ENGINE = 'bogus';
    expect(() => resolveRuntimeConfig()).toThrow(
      'Invalid DRIVER_ENGINE value: bogus. Expected one of: playwright, vibium, selenium.'
    );
  });

  it('resolves registry factory path for each known engine', async () => {
    const playwrightEngine = {
      engineType: 'playwright' as const,
      newPage: vi.fn(async () => undefined),
      close: vi.fn(async () => undefined)
    };
    const vibiumEngine = {
      engineType: 'vibium' as const,
      newPage: vi.fn(async () => undefined),
      close: vi.fn(async () => undefined)
    };
    const seleniumEngine = {
      engineType: 'selenium' as const,
      newPage: vi.fn(async () => undefined),
      close: vi.fn(async () => undefined)
    };

    vi.spyOn(PlaywrightBrowserAdapter, 'launch').mockResolvedValue(playwrightEngine as unknown as PlaywrightBrowserAdapter);
    vi.spyOn(VibiumBrowserAdapter, 'launch').mockResolvedValue(vibiumEngine as unknown as VibiumBrowserAdapter);
    vi.spyOn(SeleniumBrowserAdapter, 'launch').mockResolvedValue(seleniumEngine as unknown as SeleniumBrowserAdapter);

    process.env.DRIVER_ENGINE = 'playwright';
    await DriverRegistry.getAutomationEngine();
    await DriverRegistry.closeAutomationEngine();

    process.env.DRIVER_ENGINE = 'vibium';
    await DriverRegistry.getAutomationEngine();
    await DriverRegistry.closeAutomationEngine();

    process.env.DRIVER_ENGINE = 'selenium';
    await DriverRegistry.getAutomationEngine();
    await DriverRegistry.closeAutomationEngine();

    expect(playwrightEngine.newPage).toHaveBeenCalledTimes(1);
    expect(vibiumEngine.newPage).toHaveBeenCalledTimes(1);
    expect(seleniumEngine.newPage).toHaveBeenCalledTimes(1);
  });
});
