import { describe, expect, it } from 'vitest';
import config from '../../playwright.config';

describe('playwright config', () => {
  it('uses CI-aware retry policy and html reporter', () => {
    expect(config.retries).toSatisfy((value: unknown) => value === 0 || value === 2);
    expect(config.reporter).toEqual([
      ['list'],
      ['html', { outputFolder: 'playwright-report', open: 'never' }]
    ]);
  });
});
