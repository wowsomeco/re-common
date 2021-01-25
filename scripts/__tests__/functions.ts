import {
  capitalize,
  clone,
  hasNumbers,
  loop,
  mapRecord,
  subDomain,
  tap
} from '../extensions';

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
    const arr1 = [1, 4, 7, 10, 15, 3];
    const arr2 = [];
    let firstItem = -1;
    let lastItem = -1;

    loop(arr1, ({ item, first, last }) => {
      if (first) firstItem = item;
      if (last) lastItem = item;

      arr2.push(item);
    });

    // make sure the first item is 1
    expect(firstItem).toBe(1);
    // make sure the last item is 3
    expect(lastItem).toBe(3);
    // make sure the items in both array are the same
    expect(arr1).toEqual(arr2);
  });

  test('capitalize tests', () => {
    const str1 = 'hi man how are you today?';
    const capStr1 = capitalize(str1);
    // ensure original remains
    expect(str1).toBe('hi man how are you today?');
    expect(capStr1).toBe('Hi Man How Are You Today?');

    const str2 = 'i,dont,know';
    const capStr2 = capitalize(str2, ',');
    expect(capStr2).toBe('I Dont Know');

    const capStr3 = capitalize(str2, ',', ':');
    expect(capStr3).toBe('I:Dont:Know');
  });

  test('hasNumber tests', () => {
    const str1 = '1hi man how?';
    expect(hasNumbers(str1)).toBe(true);

    const str2 = 'mann';
    expect(hasNumbers(str2)).toBe(false);
  });

  test('clone tests', () => {
    const obj1: number[] = [1, 2, 3];
    const cloneObj1 = clone(obj1);
    cloneObj1[0] = 5;
    cloneObj1[1] = 4;

    expect(obj1[0]).toBe(1);
    expect(obj1[1]).toBe(2);
    expect(obj1[2]).toBe(3);

    expect(cloneObj1[0]).toBe(5);
    expect(cloneObj1[1]).toBe(4);
    expect(cloneObj1[2]).toBe(3);
  });
});
