import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { LifecycleLogger } from '../support/lifecycle-logger';
import { resolveRuntimeConfig } from '../support/runtime-config';

interface SmokeWorld {
  smokeTask: {
    open(url: string): Promise<void>;
    title(): Promise<string>;
    mainContentVisible(): Promise<boolean>;
  } | null;
  lastTitle: string;
  scenarioName: string;
}

Given('I open the smoke page', function (this: SmokeWorld): Promise<void> {
  assert.ok(this.smokeTask, 'Smoke task was not initialized by hooks');
  const { baseUrl } = resolveRuntimeConfig();
  return this.smokeTask.open(baseUrl);
});

When('I capture the page title', function (this: SmokeWorld): Promise<void> {
  assert.ok(this.smokeTask, 'Smoke task was not initialized by hooks');
  return this.smokeTask.title().then((title) => {
    this.lastTitle = title;
  });
});

Then('the page title should not be empty', function (this: SmokeWorld): void {
  assert.notEqual(this.lastTitle.trim(), '', 'Expected a non-empty page title');
});

Then('the main content should be visible', function (this: SmokeWorld): Promise<void> {
  assert.ok(this.smokeTask, 'Smoke task was not initialized by hooks');
  return this.smokeTask.mainContentVisible().then((visible) => {
    assert.equal(visible, true, 'Expected main content to be visible');
  });
});

Then('lifecycle hooks should wrap the scenario', function (this: SmokeWorld): void {
  const scenarioEvents = LifecycleLogger.getScenarioEvents(this.scenarioName);
  const labels = scenarioEvents.map((event) => event.label);
  const globalLabels = LifecycleLogger.getEvents().map((event) => event.label);

  assert.equal(labels[0], 'Before', 'Expected Before to be the first lifecycle label');
  assert.ok(globalLabels.includes('BeforeAll'), 'Expected BeforeAll lifecycle label to be emitted');
});

Then('fixture lifecycle logs should be emitted', function (this: SmokeWorld): void {
  const scenarioEvents = LifecycleLogger.getScenarioEvents(this.scenarioName);
  const labels = scenarioEvents.map((event) => event.label);

  assert.ok(labels.includes('testDatabase Start'), 'Expected testDatabase Start fixture log');
});

Then('fixture lifecycle logs should not be emitted', function (this: SmokeWorld): void {
  const scenarioEvents = LifecycleLogger.getScenarioEvents(this.scenarioName);
  const hasFixtureLabel = scenarioEvents.some((event) =>
    event.label.includes('globalServer') || event.label.includes('testDatabase')
  );

  assert.equal(hasFixtureLabel, false, 'Expected no fixture lifecycle logs for non-opted scenario');
});

Then('cleanup lifecycle logs should be present for this scenario', function (this: SmokeWorld): void {
  const labels = LifecycleLogger.getEvents().map((event) => event.label);
  assert.ok(labels.includes('After'), 'Expected After lifecycle label for cleanup evidence');
});
