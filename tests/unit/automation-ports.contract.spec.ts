import { describe, expect, it } from 'vitest';
import { IBrowser } from '../../src/layer5-abstractions/ports/ibrowser';
import { IElement } from '../../src/layer5-abstractions/ports/ielement';
import { IPage } from '../../src/layer5-abstractions/ports/ipage';
import { PlaywrightBrowserAdapter } from '../../src/layer5-abstractions/adapter/playwright-browser.adapter';
import { PlaywrightElementAdapter } from '../../src/layer5-abstractions/adapter/playwright-element.adapter';
import { PlaywrightPageAdapter } from '../../src/layer5-abstractions/adapter/playwright-page.adapter';

describe('automation port contract', () => {
  it('adapter classes satisfy contract shape at type level', () => {
    const browserCtor: unknown = PlaywrightBrowserAdapter;
    const pageCtor: unknown = PlaywrightPageAdapter;
    const elementCtor: unknown = PlaywrightElementAdapter;

    expect(browserCtor).toBeTypeOf('function');
    expect(pageCtor).toBeTypeOf('function');
    expect(elementCtor).toBeTypeOf('function');
  });

  it('ports expose expected callable members', () => {
    const browserKeys: Array<keyof IBrowser> = ['newPage', 'close'];
    const pageKeys: Array<keyof IPage> = ['goto', 'title', 'find'];
    const elementKeys: Array<keyof IElement> = ['textContent', 'isVisible', 'click'];

    expect(browserKeys.length).toBe(2);
    expect(pageKeys.length).toBe(3);
    expect(elementKeys.length).toBe(3);
  });
});
