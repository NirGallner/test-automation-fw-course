import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const roots = [
  path.resolve(process.cwd(), 'src/layer2-step-definitions'),
  path.resolve(process.cwd(), 'src/tasks'),
  path.resolve(process.cwd(), 'src/layer4-page-objects')
];

const violations = [];

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath);
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

for (const root of roots) {
  await walk(root);
}

if (violations.length > 0) {
  console.error('Async surface violation: async/await found in Layers 1-4 paths.');
  for (const file of violations) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log('Async surface guard passed for Layers 1-4.');
