export type DriverEngine = 'playwright' | 'vibium' | 'selenium';

export interface RuntimeConfig {
  driverEngine: DriverEngine;
  baseUrl: string;
}

const ALLOWED_ENGINES: DriverEngine[] = ['playwright', 'vibium', 'selenium'];

export const resolveDriverEngine = (rawValue?: string): DriverEngine => {
  if (!rawValue) {
    return 'playwright';
  }

  const normalized = rawValue.toLowerCase();
  if (ALLOWED_ENGINES.includes(normalized as DriverEngine)) {
    return normalized as DriverEngine;
  }

  throw new Error(
    `Invalid DRIVER_ENGINE value: ${rawValue}. Expected one of: ${ALLOWED_ENGINES.join(', ')}.`
  );
};

export const resolveRuntimeConfig = (): RuntimeConfig => {
  const driverEngine = resolveDriverEngine(process.env.DRIVER_ENGINE);
  const baseUrl = process.env.SMOKE_URL ?? 'https://example.com';

  return { driverEngine, baseUrl };
};
