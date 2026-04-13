import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const guardRoots = [
  path.resolve(process.cwd(), 'src/layer2-step-definitions'),
  path.resolve(process.cwd(), 'src/tasks'),
  path.resolve(process.cwd(), 'src/layer4-page-objects')
];

const collectViolations = async (dir: string, violations: string[]): Promise<void> => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await collectViolations(fullPath, violations);
      continue;
    }

    if (!fullPath.endsWith('.ts')) {
      continue;
    }

    const content = await readFile(fullPath, 'utf8');
    if (/\basync\b|\bawait\b/.test(content)) {
      violations.push(path.relative(process.cwd(), fullPath));
    }
  }
};

describe('async surface guard', () => {
  it('prevents async/await in layer 2-4 source files', async () => {
    const violations: string[] = [];

    for (const root of guardRoots) {
      await collectViolations(root, violations);
    }

    expect(violations).toEqual([]);
  });
});
