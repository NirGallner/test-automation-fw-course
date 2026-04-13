import { describe, expect, it, vi } from 'vitest';
import { HomeSmokeTask } from '../../src/tasks/home-smoke.task';
import { IAutomationEngine } from '../../src/layer5-abstractions/ports/iautomation-engine';

const createEngineStub = (engineType: 'playwright' | 'vibium'): IAutomationEngine => {
  return {
    engineType,
    newPage: vi.fn(async () => undefined),
    close: vi.fn(async () => undefined),
    openUrl: vi.fn(async () => undefined),
    getTitle: vi.fn(async () => `${engineType} title`),
    click: vi.fn(async () => undefined),
    enterText: vi.fn(async () => undefined),
    hover: vi.fn(async () => undefined),
    getTextContent: vi.fn(async () => 'content'),
    isVisible: vi.fn<IAutomationEngine['isVisible']>().mockResolvedValue(true),
    waitForVisible: vi.fn(async () => undefined),
    switchToFrame: vi.fn(async () => undefined),
    switchToWindow: vi.fn(async () => undefined),
    startTrace: vi.fn(async () => undefined),
    stopTrace: vi.fn(async () => 'trace.zip'),
    useDevtoolsProtocol: vi.fn(async () => ({}))
  };
};

describe('HomeSmokeTask', () => {
  it.each(['playwright', 'vibium'] as const)(
    'opens URL and reads title/content on %s',
    async (engineName) => {
      const engine = createEngineStub(engineName);
      const task = new HomeSmokeTask(engine);

      await task.open('https://example.com');
      await expect(task.title()).resolves.toBe(`${engineName} title`);
      await expect(task.mainContentVisible()).resolves.toBe(true);

      expect(engine.openUrl).toHaveBeenCalledWith('https://example.com');
      expect(engine.isVisible).toHaveBeenCalledWith('main');
    }
  );

  it('falls back to body visibility when main is hidden', async () => {
    const engine = createEngineStub('playwright');
    vi.mocked(engine.isVisible)
      .mockReset()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    const task = new HomeSmokeTask(engine);

    await expect(task.mainContentVisible()).resolves.toBe(true);

    expect(engine.isVisible).toHaveBeenNthCalledWith(1, 'main');
    expect(engine.isVisible).toHaveBeenNthCalledWith(2, 'body');
  });

  it('preserves sequential behavior for open/title checks', async () => {
    const engine = createEngineStub('vibium');
    const task = new HomeSmokeTask(engine);

    await task.open('https://example.com');
    await task.title();

    expect(engine.openUrl).toHaveBeenCalledTimes(1);
    expect(engine.getTitle).toHaveBeenCalledTimes(1);
  });
});
