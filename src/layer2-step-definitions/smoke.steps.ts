import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { resolveRuntimeConfig } from '../support/runtime-config';

interface SmokeWorld {
  smokeTask: {
    open(url: string): Promise<void>;
    title(): Promise<string>;
    mainContentVisible(): Promise<boolean>;
  } | null;
  lastTitle: string;
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
