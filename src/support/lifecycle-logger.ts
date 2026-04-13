/**
 * Identifies the lifecycle phase that a log event belongs to.
 * Values match Cucumber hook names and driver lifecycle events.
 */
export type LifecyclePhase =
  | 'BeforeAll'
  | 'Before'
  | 'After'
  | 'AfterAll'
  | 'FixtureStart'
  | 'FixtureEnd'
  | 'DriverStart'
  | 'DriverEnd';

/** A single recorded lifecycle event with monotonically increasing `sequence`. */
export interface LifecycleLogEvent {
  /** Monotonically increasing counter across the test run. */
  sequence: number;
  /** Lifecycle stage at which this event was emitted. */
  phase: LifecyclePhase;
  /** Free-text description of what occurred. */
  label: string;
  /** Cucumber scenario name, present when the event is scenario-scoped. */
  scenarioName?: string;
}

/** Delimiter used when building the scoped console label from label + scenario name. */
const EVENT_SCOPE_SEPARATOR = ' | ';

/**
 * In-memory, append-only log of lifecycle events across a test run.
 * Provides the single source of truth for lifecycle assertions in unit tests
 * and Gherkin verification steps. Calling `reset()` before each run prevents
 * state leak between test suites.
 */
export class LifecycleLogger {
  private static events: LifecycleLogEvent[] = [];
  private static sequence = 0;

  /** Clears all recorded events and resets the sequence counter. */
  public static reset(): void {
    LifecycleLogger.events = [];
    LifecycleLogger.sequence = 0;
  }

  /**
   * Appends a lifecycle event and writes a labelled line to `console.log`.
   * @param phase - Which lifecycle phase is being logged.
   * @param label - Short description of the event.
   * @param scenarioName - Cucumber scenario name when the event is scenario-scoped.
   */
  public static log(phase: LifecyclePhase, label: string, scenarioName?: string): void {
    const event: LifecycleLogEvent = {
      sequence: ++LifecycleLogger.sequence,
      phase,
      label,
      scenarioName
    };

    LifecycleLogger.events.push(event);

    const scopedLabel = scenarioName
      ? `${label}${EVENT_SCOPE_SEPARATOR}Scenario: ${scenarioName}`
      : label;
    console.log(`[Lifecycle ${event.sequence}] ${phase}: ${scopedLabel}`);
  }

  /**
   * Logs a fixture lifecycle event only when the scenario has opted in to
   * fixture allocation (`fixtureOptIn === true`). Automatically derives the
   * phase (`FixtureStart` or `FixtureEnd`) from the label suffix.
   *
   * @param label - Event label, must end with `'Start'` or `'End'`.
   * @param scenarioName - Cucumber scenario that owns this fixture event.
   * @param fixtureOptIn - Whether this scenario opted into fixture allocation.
   */
  public static logFixture(label: string, scenarioName: string, fixtureOptIn: boolean): void {
    if (!fixtureOptIn) {
      return;
    }

    const phase: LifecyclePhase = label.includes('End') ? 'FixtureEnd' : 'FixtureStart';
    LifecycleLogger.log(phase, label, scenarioName);
  }

  /** Returns a shallow copy of all recorded events in insertion order. */
  public static getEvents(): LifecycleLogEvent[] {
    return [...LifecycleLogger.events];
  }

  /**
   * Returns all events whose `scenarioName` matches the given name.
   * @param scenarioName - Cucumber scenario name to filter by.
   */
  public static getScenarioEvents(scenarioName: string): LifecycleLogEvent[] {
    return LifecycleLogger.events.filter((event) => event.scenarioName === scenarioName);
  }
}