import { describe, it, expect } from 'vitest';
import { createSerialQueue } from './serialQueue';

function deferred() {
  let resolve!: () => void;
  let reject!: (e: Error) => void;
  const promise = new Promise<void>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

const flushMicrotasks = () => new Promise((r) => setTimeout(r, 0));

describe('createSerialQueue', () => {
  it('starts the next task only after the previous one settles', async () => {
    const run = createSerialQueue();
    const first = deferred();
    const started: string[] = [];

    const a = run(() => { started.push('a'); return first.promise; });
    const b = run(async () => { started.push('b'); });
    await flushMicrotasks();
    expect(started).toEqual(['a']);

    first.resolve();
    await Promise.all([a, b]);
    expect(started).toEqual(['a', 'b']);
  });

  it('keeps running after a task fails, and still rejects that task', async () => {
    const run = createSerialQueue();
    const failed = run(() => Promise.reject(new Error('busy')));
    const next = run(async () => 'ok');

    await expect(failed).rejects.toThrow('busy');
    await expect(next).resolves.toBe('ok');
  });
});
