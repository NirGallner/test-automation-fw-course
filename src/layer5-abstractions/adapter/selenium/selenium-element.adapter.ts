import { createUnsupportedCapabilityError } from '../../../support/exception-manager';

export class SeleniumElementAdapter {
  public click(): Promise<void> {
    return Promise.reject(createUnsupportedCapabilityError('click', 'Selenium'));
  }

  public textContent(): Promise<string> {
    return Promise.reject(createUnsupportedCapabilityError('getTextContent', 'Selenium'));
  }

  public isVisible(): Promise<boolean> {
    return Promise.reject(createUnsupportedCapabilityError('isVisible', 'Selenium'));
  }
}