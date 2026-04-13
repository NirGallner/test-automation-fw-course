export type LifecyclePhase =
  | 'BeforeAll'
  | 'Before'
  | 'After'
  | 'AfterAll'
  | 'FixtureStart'
  | 'FixtureEnd'
  | 'DriverStart'
  | 'DriverEnd';

export interface LifecycleLogEvent {
  sequence: number;
  phase: LifecyclePhase;
  label: string;
  scenarioName?: string;
}

const EVENT_SCOPE_SEPARATOR = ' | ';

export class LifecycleLogger {
  private static events: LifecycleLogEvent[] = [];
  private static sequence = 0;

  public static reset(): void {
    LifecycleLogger.events = [];
    LifecycleLogger.sequence = 0;
  }

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

  public static logFixture(label: string, scenarioName: string, fixtureOptIn: boolean): void {
    if (!fixtureOptIn) {
      return;
    }

    const phase: LifecyclePhase = label.includes('End') ? 'FixtureEnd' : 'FixtureStart';
    LifecycleLogger.log(phase, label, scenarioName);
  }

  public static getEvents(): LifecycleLogEvent[] {
    return [...LifecycleLogger.events];
  }

  public static getScenarioEvents(scenarioName: string): LifecycleLogEvent[] {
    return LifecycleLogger.events.filter((event) => event.scenarioName === scenarioName);
  }
}