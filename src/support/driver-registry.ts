import { PlaywrightBrowserAdapter } from '../layer5-abstractions/adapter/playwright-browser.adapter';
import { VibiumBrowserAdapter } from '../layer5-abstractions/adapter/vibium-browser.adapter';
import { IBrowser } from '../layer5-abstractions/ports/ibrowser';
import { resolveRuntimeConfig, type DriverEngine } from './runtime-config';

type BrowserFactory = () => Promise<IBrowser>;

export class DriverRegistry {
  private static browser: IBrowser | null = null;

  public static getSelectedEngine(): DriverEngine {
    return resolveRuntimeConfig().driverEngine;
  }

  public static async getBrowser(): Promise<IBrowser> {
    if (DriverRegistry.browser) {
      return DriverRegistry.browser;
    }

    const factory = DriverRegistry.resolveFactory(DriverRegistry.getSelectedEngine());
    DriverRegistry.browser = await factory();
    return DriverRegistry.browser;
  }

  public static async closeBrowser(): Promise<void> {
    if (!DriverRegistry.browser) {
      return;
    }

    await DriverRegistry.browser.close();
    DriverRegistry.browser = null;
  }

  private static resolveFactory(engine: DriverEngine): BrowserFactory {
    if (engine === 'vibium') {
      return async () => VibiumBrowserAdapter.launch();
    }

    return async () => PlaywrightBrowserAdapter.launch();
  }
}
