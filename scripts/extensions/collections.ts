/**
 * Maps a record / object into an array of T
 * @param record the object itself
 * @param callback callback to the called where k is the key, and v is the value of the object respectively
 */
export function mapRecord<T>(
  record: Record<any, any>,
  callback: (k: any, v: any) => T
): T[] {
  const t: T[] = [];
  for (const k in record) {
    t.push(callback(k, record[k]));
  }
  return t;
}

/** [[loop]] function callback */
export interface LoopCallback<T> {
  item: T;
  idx: number;
  first: boolean;
  last: boolean;
  prev: T | undefined;
}

/** iterates over the array with a custom callback [[LoopCalback]] for each of them  */
export function loop<T>(arr: T[], callback: (d: LoopCallback<T>) => void) {
  if (!arr) return;

  for (let idx = 0; idx < arr.length; idx++) {
    const item = arr[idx];
    const prev = idx > 0 ? arr[idx - 1] : undefined;
    const first = idx === 0;
    const last = idx === arr.length - 1;
    callback({ item, idx, first, last, prev });
  }
}
