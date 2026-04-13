import { describe, expect, it } from 'vitest';
import config from '../../playwright.config';
import { resolveDriverEngine } from '../../src/support/runtime-config';

describe('playwright config', () => {
  it('uses CI-aware retry policy and html reporter', () => {
    expect(config.retries).toSatisfy((value: unknown) => value === 0 || value === 2);
    expect(config.reporter).toEqual([
      ['list'],
      ['html', { outputFolder: 'playwright-report', open: 'never' }]
    ]);
  });

  it('accepts known driver engine values', () => {
    expect(resolveDriverEngine('playwright')).toBe('playwright');
    expect(resolveDriverEngine('vibium')).toBe('vibium');
    expect(resolveDriverEngine('selenium')).toBe('selenium');
  });

  it('throws for invalid driver engine value', () => {
    expect(() => resolveDriverEngine('invalid-engine')).toThrow(
      'Invalid DRIVER_ENGINE value: invalid-engine. Expected one of: playwright, vibium, selenium.'
    );
  });
});
