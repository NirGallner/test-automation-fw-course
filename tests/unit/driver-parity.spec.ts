import { describe, expect, it } from 'vitest';
import { resolveRuntimeConfig } from '../../src/support/runtime-config';

describe('driver parity selection', () => {
  it('defaults to playwright when no driver is provided', () => {
    delete process.env.DRIVER_ENGINE;
    expect(resolveRuntimeConfig().driverEngine).toBe('playwright');
  });

  it('supports vibium through runtime configuration', () => {
    process.env.DRIVER_ENGINE = 'vibium';
    expect(resolveRuntimeConfig().driverEngine).toBe('vibium');
    delete process.env.DRIVER_ENGINE;
  });
});
