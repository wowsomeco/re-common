import {
  capitalize,
  hasNumbers,
  hasWhiteSpace,
  subDomain
} from '../extensions';

describe('functions tests', () => {
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

    const str3 = 'hi1 man ho1w?';
    expect(hasNumbers(str3)).toBe(true);
  });

  test('hasWhitespace tests', () => {
    const str1 = '1hi man how?';
    expect(hasWhiteSpace(str1)).toBe(true);

    const str2 = 'mann';
    expect(hasWhiteSpace(str2)).toBe(false);
  });
});
