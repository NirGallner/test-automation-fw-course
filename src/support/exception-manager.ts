/** Contextual detail passed to `ExceptionManager` when a failure must be handled. */
export interface FailureContext {
  /** Identifies the origin (e.g. `'cucumber.after'`, `'driver-registry'`). */
  source: string;
  /** Human-readable failure description. */
  message: string;
  /** Name of the Cucumber scenario in which the failure occurred, if applicable. */
  scenarioName?: string;
  /** Gherkin step text associated with the failure, if applicable. */
  stepName?: string;
  /** Original error or caught exception for inclusion in the failure chain. */
  error?: unknown;
}

/**
 * Creates a standardized `Error` indicating that `methodName` is not
 * implemented by the given `toolName` engine adapter.
 *
 * @param methodName - The `IAutomationEngine` method that was called.
 * @param toolName - Display name of the engine (e.g. `'Selenium'`).
 */
export const createUnsupportedCapabilityError = (methodName: string, toolName: string): Error => {
  return new Error(`${methodName} is not supported by the ${toolName} engine.`);
};

/**
 * Centralised failure handler that converts `FailureContext` objects into
 * thrown errors with structured diagnostic messages. All execution failures
 * MUST flow through this class so that logging, escalation, and AI recovery
 * decisions remain consistent and reviewable.
 */
export class ExceptionManager {
  /**
   * Formats the failure context into a structured error message and throws.
   * Always returns `never`; the return type is declared to support type-safe
   * call sites that need to prove a branch is unreachable after calling this.
   */
  public handleFailure(context: FailureContext): never {
    const detail = [
      `[${context.source}] ${context.message}`,
      context.scenarioName ? `Scenario: ${context.scenarioName}` : '',
      context.stepName ? `Step: ${context.stepName}` : ''
    ]
      .filter(Boolean)
      .join(' | ');

    throw new Error(detail, { cause: context.error });
  }

  /**
   * Delegates to `handleFailure` after appending `.cleanup` to the source
   * identifier and providing a fallback message when none is given.
   * Use this variant for fixture and driver teardown paths.
   */
  public handleCleanupFailure(context: FailureContext): never {
    return this.handleFailure({
      ...context,
      source: `${context.source}.cleanup`,
      message: context.message || 'Fixture cleanup failed'
    });
  }
}
