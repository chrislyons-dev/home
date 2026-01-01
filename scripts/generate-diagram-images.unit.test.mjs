import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fsPromisesMock = {
  readdir: vi.fn(),
  stat: vi.fn(),
  readFile: vi.fn(),
  mkdir: vi.fn(),
};
const spawnSyncMock = vi.fn();
const encodeMock = vi.fn(() => 'encoded');

const setup = async () => {
  vi.resetModules();
  vi.doMock('node:fs', () => ({
    promises: fsPromisesMock,
    default: { promises: fsPromisesMock },
  }));
  vi.doMock('node:child_process', () => ({
    spawnSync: spawnSyncMock,
    default: { spawnSync: spawnSyncMock },
  }));
  vi.doMock('plantuml-encoder', () => ({ encode: encodeMock }));

  const module = await import('./generate-diagram-images.mjs');
  return { module };
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('generate-diagram-images (unit)', () => {
  it('returns 0 when no Mermaid files exist', async () => {
    const { module } = await setup();
    fsPromisesMock.readdir.mockResolvedValue(['notes.txt']);

    const count = await module.generateMermaidImages();
    expect(count).toBe(0);
  });

  it('counts Mermaid diagrams when output is created', async () => {
    const { module } = await setup();
    fsPromisesMock.readdir.mockResolvedValue(['diagram.mmd']);
    fsPromisesMock.stat.mockResolvedValue({ size: 12 });
    spawnSyncMock.mockReturnValue({ status: 0, stderr: '' });

    const count = await module.generateMermaidImages();
    expect(count).toBe(1);
    expect(spawnSyncMock).toHaveBeenCalled();
  });

  it('handles Mermaid output stat failures', async () => {
    const { module } = await setup();
    fsPromisesMock.readdir.mockResolvedValue(['diagram.mmd']);
    fsPromisesMock.stat.mockRejectedValue(new Error('missing'));
    spawnSyncMock.mockReturnValue({ status: 1, stderr: 'error' });

    const count = await module.generateMermaidImages();
    expect(count).toBe(0);
  });

  it('adds Puppeteer args in CI mode', async () => {
    const { module } = await setup();
    const originalCI = process.env.CI;
    process.env.CI = 'true';

    fsPromisesMock.readdir.mockResolvedValue(['diagram.mmd']);
    fsPromisesMock.stat.mockResolvedValue({ size: 12 });
    spawnSyncMock.mockReturnValue({ status: 0, stderr: '' });

    await module.generateMermaidImages();

    const args = spawnSyncMock.mock.calls[0][1];
    expect(args).toContain('-p');
    expect(args).toContain('puppeteer-config.json');

    process.env.CI = originalCI;
  });

  it('flags empty Mermaid output files', async () => {
    const { module } = await setup();
    fsPromisesMock.readdir.mockResolvedValue(['diagram.mmd']);
    fsPromisesMock.stat.mockResolvedValue({ size: 0 });
    spawnSyncMock.mockReturnValue({ status: 0, stderr: '' });

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const count = await module.generateMermaidImages();
    expect(count).toBe(0);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('handles invalid Mermaid filenames', async () => {
    const { module } = await setup();
    fsPromisesMock.readdir.mockResolvedValue(['bad;name.mmd']);
    spawnSyncMock.mockReturnValue({ status: 0, stderr: '' });

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const count = await module.generateMermaidImages();
    expect(count).toBe(0);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('retries PlantUML fetches and succeeds', async () => {
    const { module } = await setup();
    vi.useFakeTimers();
    spawnSyncMock.mockReturnValueOnce({ status: 1 }).mockReturnValueOnce({ status: 0 });
    fsPromisesMock.stat.mockResolvedValue({ size: 20 });

    const promise = module.fetchPlantUMLWithRetry('https://example.com', 'out.svg', 2);
    await vi.advanceTimersByTimeAsync(1000);
    const result = await promise;

    expect(result).toBe(true);
  });

  it('returns false when PlantUML retries are exhausted', async () => {
    const { module } = await setup();
    spawnSyncMock.mockReturnValue({ status: 1 });

    const result = await module.fetchPlantUMLWithRetry('https://example.com', 'out.svg', 1);
    expect(result).toBe(false);
  });

  it('throws on final PlantUML retry when spawn fails', async () => {
    const { module } = await setup();
    spawnSyncMock.mockImplementation(() => {
      throw new Error('boom');
    });

    await expect(
      module.fetchPlantUMLWithRetry('https://example.com', 'out.svg', 1)
    ).rejects.toThrow('boom');
  });

  it('counts PlantUML diagrams when fetch succeeds', async () => {
    const { module } = await setup();
    fsPromisesMock.readdir.mockResolvedValue(['diagram.puml']);
    fsPromisesMock.readFile.mockResolvedValue('@startuml\n@enduml');
    fsPromisesMock.stat.mockResolvedValue({ size: 20 });
    spawnSyncMock.mockReturnValue({ status: 0 });

    const count = await module.generatePlantUMLImages();
    expect(count).toBe(1);
  });

  it('logs failure when PlantUML fetch returns false', async () => {
    const { module } = await setup();
    vi.useFakeTimers();

    fsPromisesMock.readdir.mockResolvedValue(['diagram.puml']);
    fsPromisesMock.readFile.mockResolvedValue('@startuml\n@enduml');
    spawnSyncMock.mockReturnValue({ status: 1 });

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const promise = module.generatePlantUMLImages();

    await vi.runAllTimersAsync();
    await promise;

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('runs main without throwing when no diagrams exist', async () => {
    const { module } = await setup();
    fsPromisesMock.readdir.mockResolvedValue([]);
    fsPromisesMock.mkdir.mockResolvedValue(undefined);

    await expect(module.main()).resolves.toBeUndefined();
  });

  it('runs main when invoked as entrypoint', async () => {
    const originalArgv = process.argv[1];
    const entryPath = path.resolve(__dirname, 'generate-diagram-images.mjs');
    process.argv[1] = entryPath;

    vi.resetModules();
    vi.doMock('node:fs', () => ({
      promises: fsPromisesMock,
      default: { promises: fsPromisesMock },
    }));
    vi.doMock('node:child_process', () => ({
      spawnSync: spawnSyncMock,
      default: { spawnSync: spawnSyncMock },
    }));
    vi.doMock('plantuml-encoder', () => ({ encode: encodeMock }));

    fsPromisesMock.readdir.mockResolvedValue([]);
    fsPromisesMock.mkdir.mockResolvedValue(undefined);

    await import('./generate-diagram-images.mjs');

    process.argv[1] = originalArgv;
  });
});
