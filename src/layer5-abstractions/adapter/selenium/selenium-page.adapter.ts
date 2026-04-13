import { createUnsupportedCapabilityError } from '../../../support/exception-manager';

export class SeleniumPageAdapter {
  public goto(_url: string): Promise<void> {
    return Promise.reject(createUnsupportedCapabilityError('openUrl', 'Selenium'));
  }

  public title(): Promise<string> {
    return Promise.reject(createUnsupportedCapabilityError('getTitle', 'Selenium'));
  }
}