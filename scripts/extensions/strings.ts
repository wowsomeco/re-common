export function hexToRgb(hex: string): Record<string, number> | undefined {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  return undefined;
}

export function toRgba(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  return `rgba(${[rgb?.r, rgb?.g, rgb?.b].join(',')},${opacity})`;
}

export function subDomain(): string {
  const firstDomain = window.location.host.split('.')[0];
  // removes the port along with its semicolon
  const withNoDigits = firstDomain.replace(/[0-9]/g, '');
  const outputString = withNoDigits.replace(/:([^:]*)$/, '$1');
  return outputString;
}

/**
 * Capitalizes a string
 *
 * @param str the string to capitalize
 * @param separator the separator between the word
 * @param replaceWith if defined, will replace the separator with this
 *
 * e.g
 * ```typescript
 * const str = 'i,dont,know';
 * const cap = capitalize(str, ',', ':'); // i.e. I:Dont:Know
 * ```
 */
export function capitalize(
  str: string,
  separator: string = ' ',
  replaceWith: string = ' '
): string {
  let capitalized: string = '';

  const splits: string[] = str.split(separator);

  for (let i = 0; i < splits.length; i++) {
    const s = splits[i];
    capitalized += `${s[0].toUpperCase()}${s.substring(1)}`;
    // if last, replace separator with the provided replaceWith str
    if (i < splits.length - 1) capitalized += replaceWith;
  }

  return capitalized;
}

/**
 * Checks whether the given str constains any numbers.
 */
export function hasNumbers(str: string): boolean {
  return /\d/.test(str);
}

export function isDigitOnly(str: string): boolean {
  return /^\d+$/.test(str);
}

/**
 *  Checks whether the given str constains any whitespaces.
 */
export function hasWhiteSpace(s: string): boolean {
  return s ? s.includes(' ') : false;
}

export function isEmptyStr(s: string): boolean {
  return s === '';
}
