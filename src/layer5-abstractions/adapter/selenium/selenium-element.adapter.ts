import { createUnsupportedCapabilityError } from '../../../support/exception-manager';

/**
 * Stub element adapter for the Selenium engine. All methods reject with an
 * unsupported-capability error until real Selenium element interaction is
 * implemented.
 */
export class SeleniumElementAdapter {
  /** @inheritdoc */
  public click(): Promise<void> {
    return Promise.reject(createUnsupportedCapabilityError('click', 'Selenium'));
  }

  /** @inheritdoc */
  public textContent(): Promise<string> {
    return Promise.reject(createUnsupportedCapabilityError('getTextContent', 'Selenium'));
  }

  /** @inheritdoc */
  public isVisible(): Promise<boolean> {
    return Promise.reject(createUnsupportedCapabilityError('isVisible', 'Selenium'));
  }
}