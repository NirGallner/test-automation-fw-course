export interface FailureContext {
  source: string;
  message: string;
  scenarioName?: string;
  stepName?: string;
  error?: unknown;
}

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
}
