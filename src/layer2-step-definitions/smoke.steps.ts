import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { LifecycleLogger } from '../support/lifecycle-logger';
import { resolveRuntimeConfig } from '../support/runtime-config';

/**
 * Partial view of `SmokeWorld` needed by these step definitions.
 * Only the properties accessed from steps are declared here; the full
 * implementation lives in `src/support/hooks.ts`.
 */
interface SmokeWorld {
  /** High-level smoke task wired to the active engine by the Before hook. */
  smokeTask: {
    open(url: string): Promise<void>;
    title(): Promise<string>;
    mainContentVisible(): Promise<boolean>;
  } | null;
  /** Last page title captured by the 'I capture the page title' step. */
  lastTitle: string;
  /** Cucumber scenario name set by the Before hook. */
  scenarioName: string;
}

/** Opens the configured `baseUrl` in the active engine. */
Given('I open the smoke page', function (this: SmokeWorld): Promise<void> {
  assert.ok(this.smokeTask, 'Smoke task was not initialized by hooks');
  const { baseUrl } = resolveRuntimeConfig();
  return this.smokeTask.open(baseUrl);
});

/** Reads the current page title and stores it on the World for later assertions. */
When('I capture the page title', function (this: SmokeWorld): Promise<void> {
  assert.ok(this.smokeTask, 'Smoke task was not initialized by hooks');
  return this.smokeTask.title().then((title) => {
    this.lastTitle = title;
  });
});

/** Asserts that the captured page title is not blank. */
Then('the page title should not be empty', function (this: SmokeWorld): void {
  assert.notEqual(this.lastTitle.trim(), '', 'Expected a non-empty page title');
});

/** Asserts that the main content area is visible on the current page. */
Then('the main content should be visible', function (this: SmokeWorld): Promise<void> {
  assert.ok(this.smokeTask, 'Smoke task was not initialized by hooks');
  return this.smokeTask.mainContentVisible().then((visible) => {
    assert.equal(visible, true, 'Expected main content to be visible');
  });
});

/** Verifies that BeforeAll and Before lifecycle events were emitted for this scenario. */
Then('lifecycle hooks should wrap the scenario', function (this: SmokeWorld): void {
  const scenarioEvents = LifecycleLogger.getScenarioEvents(this.scenarioName);
  const labels = scenarioEvents.map((event) => event.label);
  const globalLabels = LifecycleLogger.getEvents().map((event) => event.label);

  assert.equal(labels[0], 'Before', 'Expected Before to be the first lifecycle label');
  assert.ok(globalLabels.includes('BeforeAll'), 'Expected BeforeAll lifecycle label to be emitted');
});

/** Verifies that fixture lifecycle log entries were emitted (opt-in scenarios). */
Then('fixture lifecycle logs should be emitted', function (this: SmokeWorld): void {
  const scenarioEvents = LifecycleLogger.getScenarioEvents(this.scenarioName);
  const labels = scenarioEvents.map((event) => event.label);

  assert.ok(labels.includes('testDatabase Start'), 'Expected testDatabase Start fixture log');
});

/** Verifies that NO fixture lifecycle logs were emitted (non-opted scenarios). */
Then('fixture lifecycle logs should not be emitted', function (this: SmokeWorld): void {
  const scenarioEvents = LifecycleLogger.getScenarioEvents(this.scenarioName);
  const hasFixtureLabel = scenarioEvents.some((event) =>
    event.label.includes('globalServer') || event.label.includes('testDatabase')
  );

  assert.equal(hasFixtureLabel, false, 'Expected no fixture lifecycle logs for non-opted scenario');
});

/** Verifies that the After cleanup hook log was recorded for this scenario. */
Then('cleanup lifecycle logs should be present for this scenario', function (this: SmokeWorld): void {
  const labels = LifecycleLogger.getEvents().map((event) => event.label);
  assert.ok(labels.includes('After'), 'Expected After lifecycle label for cleanup evidence');
});
