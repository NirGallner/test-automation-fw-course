import { PlaywrightBrowserAdapter } from '../layer5-abstractions/adapter/playwright/playwright-browser.adapter';
import { SeleniumBrowserAdapter } from '../layer5-abstractions/adapter/selenium/selenium-browser.adapter';
import { VibiumBrowserAdapter } from '../layer5-abstractions/adapter/vibium/vibium-browser.adapter';
import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';
import { AutomationFixtureManager } from './lifecycle-fixtures';
import { resolveRuntimeConfig, type DriverEngine } from './runtime-config';

type EngineFactory = () => Promise<IAutomationEngine>;

export class DriverRegistry {
  private static engine: IAutomationEngine | null = null;

  public static getSelectedEngine(): DriverEngine {
    return resolveRuntimeConfig().driverEngine;
  }

  public static async getAutomationEngine(): Promise<IAutomationEngine> {
    if (DriverRegistry.engine) {
      return DriverRegistry.engine;
    }

    const factory = DriverRegistry.resolveFactory(DriverRegistry.getSelectedEngine());
    DriverRegistry.engine = await factory();
    await DriverRegistry.engine.newPage();
    AutomationFixtureManager.noteDriverSessionStarted('runtime');
    return DriverRegistry.engine;
  }

  public static async closeAutomationEngine(): Promise<void> {
    if (!DriverRegistry.engine) {
      return;
    }

    await DriverRegistry.engine.close();
    DriverRegistry.engine = null;
    AutomationFixtureManager.noteDriverSessionClosed('runtime');
  }

  private static resolveFactory(engine: DriverEngine): EngineFactory {
    if (engine === 'playwright') {
      return async () => PlaywrightBrowserAdapter.launch();
    }

    if (engine === 'vibium') {
      return async () => VibiumBrowserAdapter.launch();
    }

    if (engine === 'selenium') {
      return async () => SeleniumBrowserAdapter.launch();
    }

    throw new Error(`No automation engine factory for ${engine}.`);
  }
}
