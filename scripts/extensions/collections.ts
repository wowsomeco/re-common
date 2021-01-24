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

type LoopCallback<T> = {
  item: T;
  idx: number;
  first: boolean;
  last: boolean;
  prev: T | undefined;
};

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
