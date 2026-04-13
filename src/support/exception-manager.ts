export interface FailureContext {
  source: string;
  message: string;
  scenarioName?: string;
  stepName?: string;
  error?: unknown;
}

export const createUnsupportedCapabilityError = (methodName: string, toolName: string): Error => {
  return new Error(`${methodName} is not supported by the ${toolName} engine.`);
};

export class ExceptionManager {
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

  public handleCleanupFailure(context: FailureContext): never {
    return this.handleFailure({
      ...context,
      source: `${context.source}.cleanup`,
      message: context.message || 'Fixture cleanup failed'
    });
  }
}
