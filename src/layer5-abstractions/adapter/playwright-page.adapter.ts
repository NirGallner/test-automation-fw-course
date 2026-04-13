import type { Page } from 'playwright';
import { IElement } from '../ports/ielement';
import { IPage } from '../ports/ipage';
import { PlaywrightElementAdapter } from './playwright-element.adapter';

export class PlaywrightPageAdapter implements IPage {
  public constructor(private readonly page: Page) {}

  public async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  public async title(): Promise<string> {
    return this.page.title();
  }

  public async find(selector: string): Promise<IElement> {
    return new PlaywrightElementAdapter(this.page.locator(selector));
  }
}
