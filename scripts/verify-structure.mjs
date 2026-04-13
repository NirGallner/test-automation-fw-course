import { access } from 'node:fs/promises';
import path from 'node:path';

const requiredPaths = [
  'package.json',
  'tsconfig.json',
  'playwright.config.ts',
  'cucumber.js',
  'src/layer2-step-definitions',
  'src/tasks',
  'src/layer4-page-objects',
  'src/layer5-abstractions/ports',
  'src/layer5-abstractions/adapter',
  'tests/layer1-gherkin'
];

const missing = [];

for (const target of requiredPaths) {
  const fullPath = path.resolve(process.cwd(), target);
  try {
    await access(fullPath);
  } catch {
    missing.push(target);
  }
}

if (missing.length > 0) {
  console.error('Missing required scaffold paths:');
  for (const target of missing) {
    console.error(`- ${target}`);
  }
  process.exit(1);
}

console.log('Scaffold structure verified.');
