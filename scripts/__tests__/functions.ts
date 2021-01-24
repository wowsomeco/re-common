import { loop, mapRecord, subDomain, tap } from '../functions';

interface TapModel {
  username: string;
  password: string;
}

describe('functions tests', () => {
  test('tap function', () => {
    let model: TapModel = {
      username: 'test',
      password: 'abcd'
    };

    model = tap(model, (m) => (m.username = 'andy'));
    model = tap(model, (m) => (m.password = 'dcba'));

    expect(model.username).toBe('andy');
    expect(model.password).toBe('dcba');
  });

  test('subDomain localhost tests', () => {
    window = Object.create(window);

    Object.defineProperty(window, 'location', {
      value: {
        host: 'localhost:8000'
      },
      writable: true
    });

    const subdomain = subDomain();

    expect(subdomain).toBe('localhost');
  });

  test('subDomain real test', () => {
    Object.defineProperty(window, 'location', {
      value: {
        host: 'tester.abc.com:8000'
      },
      writable: true
    });

    const subdomain = subDomain();

    expect(subdomain).toBe('tester');
  });

  test('mapRecord can transform into array of keys', () => {
    const record: Record<string, number> = {
      a: 1,
      b: 2,
      c: 3
    };

    // transforms into array of keys
    const kArr: string[] = mapRecord(record, (k) => k);

    expect(kArr).toContain('a');
    expect(kArr).toContain('b');
    expect(kArr).toContain('c');
    expect(kArr).toHaveLength(3);
  });

  test('mapRecord can transform into array of values', () => {
    const record: Record<string, number> = {
      a: 1,
      b: 2,
      c: 3
    };

    // transforms into array of values
    const vArr: number[] = mapRecord(record, (_, v) => v);

    expect(vArr).toContain(1);
    expect(vArr).toContain(2);
    expect(vArr).toContain(3);
    expect(vArr).toHaveLength(3);
  });

  test('loop tests', () => {
    const arr1 = [1, 4, 7, 10];
    const arr2 = [];
    let firstCount = 0;
    let lastCount = 0;

    loop(arr1, ({ item, first, last }) => {
      firstCount += first ? 1 : 0;
      lastCount += last ? 1 : 0;

      arr2.push(item);
    });

    // make sure first will be called once only
    expect(firstCount).toBe(1);
    // make sure last will be called once only
    expect(lastCount).toBe(1);
    // make sure the items in both array are the same
    expect(arr1).toEqual(arr2);
  });
});
