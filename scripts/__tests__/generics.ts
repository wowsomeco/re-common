import {
  clone,
  isEmptyStr,
  loop,
  mapRecord,
  removeEmpty,
  tap
} from '../extensions';

interface TapModel {
  username: string;
  password: string;
}

describe('generics tests', () => {
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

  test('removeEmpty omit 0s and empty strings', () => {
    const obj1: Record<string, any> = {
      a: undefined,
      b: 100,
      c: '',
      d: 'aaa',
      e: 0,
      f: {
        a: '',
        c: null
      },
      g: false
    };

    const omits = [(v) => v === 0, (v) => isEmptyStr(v)];
    const obj2 = removeEmpty(obj1, omits);

    // check whether obj 1 wont get modified
    expect(obj1.a).toBeUndefined();
    expect(obj1.c).toBe('');
    expect(obj1.e).toBe(0);
    // check the cloned obj2 wont contain the empty properties anymore
    expect(obj2.a).toBeUndefined();
    // must be removed
    expect(obj2.c).toBeUndefined();
    expect(obj2.e).toBeUndefined();
    expect(obj2.f).toMatchObject({});
    expect(obj2.f.a).toBeUndefined();
    expect(obj2.f.c).toBeUndefined();
    expect(obj2.g).toBeDefined();
  });

  test('removeEmpty omit 0s', () => {
    const obj1: Record<string, any> = {
      a: undefined,
      b: 100,
      c: '',
      d: 'aaa',
      e: 0,
      f: {
        a: '',
        c: null,
        e: 0
      },
      g: false,
      h: -1,
      i: ''
    };

    const omits = [(v) => v === 0];
    const obj2 = removeEmpty(obj1, omits);

    // check the cloned obj2 wont contain the empty properties anymore
    expect(obj2.a).toBeUndefined();
    // empty string must be removed
    expect(obj2.c).toBeDefined();
    // must be removed
    expect(obj2.e).toBeUndefined();
    expect(obj2.f).toMatchObject({});
    expect(obj2.f.a).toBeDefined();
    expect(obj2.f.c).toBeUndefined();
    // must be removed
    expect(obj2.f.e).toBeUndefined();
    expect(obj2.g).toBeDefined();
    expect(obj2.h).toBeDefined();
    expect(obj2.i).toBeDefined();
  });

  test('removeEmpty omit 0s in array members', () => {
    const obj1: Record<string, any> = {
      name: 'string',
      email: undefined,
      lahans: [
        {
          noLegalitas: 'string',
          polygon: null,
          alamat: '',
          provId: 0
        }
      ]
    };

    const omits = [(v) => v === 0];
    const obj2 = removeEmpty(obj1, omits);

    expect(obj2.name).toBeDefined();
    // check the cloned obj2 wont contain the empty properties anymore
    expect(obj2.email).toBeUndefined();
    expect(obj2.lahans[0].noLegalitas).toBeDefined();
    expect(obj2.lahans[0].polygon).toBeUndefined();
    // empty string
    expect(obj2.lahans[0].alamat).toBeDefined();
    // must be removed
    expect(obj2.lahans[0].provId).toBeUndefined();
  });

  test('loop tests', () => {
    const arr1: number[] = [1, 4, 7, 10, 15, 3];
    const arr2: number[] = [];
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
});
