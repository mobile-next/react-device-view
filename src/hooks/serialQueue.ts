// Runs async tasks one at a time, in call order. Devices accept one gesture at a time, so
// a tap sent while a drag is still in flight is rejected. A failed task rejects its own
// promise but does not stop the tasks queued after it.
export function createSerialQueue() {
  let tail: Promise<unknown> = Promise.resolve();

  return <T>(task: () => Promise<T>): Promise<T> => {
    const result = tail.then(task);
    tail = result.catch(() => undefined);
    return result;
  };
}
