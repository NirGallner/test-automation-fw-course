import { access } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const requiredPaths = [
  'package.json',
  'tsconfig.json',
  'playwright.config.ts',
  'src/layer2-step-definitions',
  'src/tasks',
  'src/layer4-page-objects',
  'src/layer5-abstractions/ports',
  'src/layer5-abstractions/adapter',
  'tests/layer1-gherkin/smoke.feature'
];

describe('project scaffold structure', () => {
  it.each(requiredPaths)('contains %s', async (targetPath) => {
    const fullPath = path.resolve(process.cwd(), targetPath);
    await expect(access(fullPath)).resolves.toBeUndefined();
  });
});
