export type DriverEngine = 'playwright' | 'vibium';

export interface RuntimeConfig {
  driverEngine: DriverEngine;
  baseUrl: string;
}

export const resolveRuntimeConfig = (): RuntimeConfig => {
  const rawEngine = process.env.DRIVER_ENGINE?.toLowerCase();
  const driverEngine: DriverEngine = rawEngine === 'vibium' ? 'vibium' : 'playwright';
  const baseUrl = process.env.SMOKE_URL ?? 'https://example.com';

  return { driverEngine, baseUrl };
};
