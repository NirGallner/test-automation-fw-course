import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const srcRoot = path.resolve(process.cwd(), 'src');
const allowedSuffixes = [
  path.join('layer5-abstractions', 'adapter', 'playwright', 'playwright-browser.adapter.ts'),
  path.join('layer5-abstractions', 'adapter', 'playwright', 'playwright-page.adapter.ts'),
  path.join('layer5-abstractions', 'adapter', 'playwright', 'playwright-element.adapter.ts'),
  path.join('layer5-abstractions', 'adapter', 'vibium', 'vibium-browser.adapter.ts')
];

const matches = [];

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
    if (!content.match(/from ['\"]playwright['\"]/)) {
      continue;
    }

    const isAllowed = allowedSuffixes.some((suffix) => fullPath.endsWith(suffix));
    if (!isAllowed) {
      matches.push(path.relative(process.cwd(), fullPath));
    }
  }
};

await walk(srcRoot);

if (matches.length > 0) {
  console.error('Playwright boundary violation in:');
  for (const file of matches) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log('Playwright imports are isolated to adapter files.');
