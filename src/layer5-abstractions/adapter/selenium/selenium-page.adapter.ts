import { createUnsupportedCapabilityError } from '../../../support/exception-manager';

/**
 * Stub page adapter for the Selenium engine. All methods reject with an
 * unsupported-capability error until real Selenium page navigation is
 * implemented.
 */
export class SeleniumPageAdapter {
  /** @inheritdoc */
  public goto(_url: string): Promise<void> {
    return Promise.reject(createUnsupportedCapabilityError('openUrl', 'Selenium'));
  }

  /** @inheritdoc */
  public title(): Promise<string> {
    return Promise.reject(createUnsupportedCapabilityError('getTitle', 'Selenium'));
  }
}