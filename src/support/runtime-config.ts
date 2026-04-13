/** Union of all engine identifiers that can be selected at runtime. */
export type DriverEngine = 'playwright' | 'vibium' | 'selenium';

/** Resolved runtime configuration consumed by the test infrastructure. */
export interface RuntimeConfig {
  /** The automation engine to use for this run. */
  driverEngine: DriverEngine;
  /** Base URL that smoke tests navigate to. */
  baseUrl: string;
  /** Tag strings that opt scenarios into fixture allocation. */
  fixtures: {
    /** Opts the scenario into both worker and scenario fixtures. */
    fixtureTag: string;
    /** Opts the scenario into worker-scoped fixtures only. */
    workerFixtureTag: string;
    /** Opts the scenario into scenario-scoped fixtures only. */
    scenarioFixtureTag: string;
  };
}

/** Ordered list of valid `DRIVER_ENGINE` environment variable values. */
const ALLOWED_ENGINES: DriverEngine[] = ['playwright', 'vibium', 'selenium'];

/**
 * Resolves the `DriverEngine` from a raw environment variable string.
 * Defaults to `'playwright'` when `rawValue` is absent. Throws when the
 * value is present but does not match any allowed engine.
 *
 * @param rawValue - Raw value of the `DRIVER_ENGINE` environment variable.
 */
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

/**
 * Reads all runtime configuration from environment variables and returns a
 * fully resolved `RuntimeConfig` object. Throws via `resolveDriverEngine` if
 * the `DRIVER_ENGINE` value is invalid.
 */
export const resolveRuntimeConfig = (): RuntimeConfig => {
  const driverEngine = resolveDriverEngine(process.env.DRIVER_ENGINE);
  const baseUrl = process.env.SMOKE_URL ?? 'https://example.com';
  const fixtures = {
    fixtureTag: process.env.SMOKE_FIXTURE_TAG ?? '@fixtures',
    workerFixtureTag: process.env.SMOKE_WORKER_FIXTURE_TAG ?? '@fixture-worker',
    scenarioFixtureTag: process.env.SMOKE_SCENARIO_FIXTURE_TAG ?? '@fixture-scenario'
  };

  return { driverEngine, baseUrl, fixtures };
};
