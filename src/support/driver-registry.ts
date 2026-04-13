import { PlaywrightBrowserAdapter } from '../layer5-abstractions/adapter/playwright/playwright-browser.adapter';
import { SeleniumBrowserAdapter } from '../layer5-abstractions/adapter/selenium/selenium-browser.adapter';
import { VibiumBrowserAdapter } from '../layer5-abstractions/adapter/vibium/vibium-browser.adapter';
import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';
import { AutomationFixtureManager } from './lifecycle-fixtures';
import { resolveRuntimeConfig, type DriverEngine } from './runtime-config';

/** Factory function signature for asynchronously constructing an `IAutomationEngine`. */
type EngineFactory = () => Promise<IAutomationEngine>;

/**
 * Singleton registry responsible for resolving, launching, and closing the
 * active `IAutomationEngine` for the test run. The engine is lazily created
 * on the first call to `getAutomationEngine` and held in a static field so
 * all Cucumber hooks share the same instance within a worker process.
 */
export class DriverRegistry {
  private static engine: IAutomationEngine | null = null;

  /** Returns the `DriverEngine` identifier configured for the current run. */
  public static getSelectedEngine(): DriverEngine {
    return resolveRuntimeConfig().driverEngine;
  }

  /**
   * Returns the active engine instance, launching it if none exists yet.
   * Calls `newPage()` immediately after launch so the engine is ready for
   * navigation without a separate setup step.
   */
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

  /**
   * Closes the active engine and clears the cached instance. A no-op when
   * no engine has been created. Should be called from the Cucumber AfterAll
   * or After hook to prevent browser processes from leaking between runs.
   */
  public static async closeAutomationEngine(): Promise<void> {
    if (!DriverRegistry.engine) {
      return;
    }

    await DriverRegistry.engine.close();
    DriverRegistry.engine = null;
    AutomationFixtureManager.noteDriverSessionClosed('runtime');
  }

  /**
   * Returns the `EngineFactory` for the given engine identifier.
   * Throws when no factory is registered for `engine`, which would indicate
   * a missing entry in the allowed-engines list rather than user input error.
   *
   * @param engine - The resolved `DriverEngine` value from runtime config.
   */
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
