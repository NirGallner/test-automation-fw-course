import { describe, expect, it, vi } from 'vitest';
import { HomeSmokeTask } from '../../src/tasks/home-smoke.task';
import { IPage } from '../../src/layer5-abstractions/ports/ipage';
import { IElement } from '../../src/layer5-abstractions/ports/ielement';

describe('HomeSmokeTask', () => {
  it('opens the provided URL and returns title/visibility data', async () => {
    const goto = vi.fn(async () => undefined);
    const title = vi.fn(async () => 'Example Domain');
    const isVisible = vi.fn(async () => true);
    const textContent = vi.fn(async () => 'Main');
    const click = vi.fn(async () => undefined);

    const element: IElement = { isVisible, textContent, click };
    const find = vi.fn(async () => element);

    const page: IPage = { goto, title, find };
    const task = new HomeSmokeTask(page);

    await task.open('https://example.com');
    await expect(task.title()).resolves.toBe('Example Domain');
    await expect(task.mainContentVisible()).resolves.toBe(true);

    expect(goto).toHaveBeenCalledWith('https://example.com');
    expect(find).toHaveBeenCalledWith('main');
  });
});
