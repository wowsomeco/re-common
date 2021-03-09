import { FileModel } from '~w-common/hooks/useFileUpload';

import { lastSplit } from './strings';

/**
 * Useful when you need to call method before returning the value of t itself afterwards.
 *
 * @param t The object
 * @param action The callback that gets triggered before returning t.
 *
 * e.g.
 * ```tsx
 * const [model, setModel] = useState<LoginModel>(new LoginModel());
 *
 * <TextField
 *  onChange={(e) => setModel(tap(model, m => m.password = e.target.value))}
 *  required
 *  fullWidth
 *  name="password"
 *  label="Password"
 *  type="password"
 * />
 * ```
 */
export function tap<T>(t: T, action: (T) => void): T {
  action(t);
  return t;
}

/**
 * Clones a new copy of the given t
 */
export function clone<T>(t: T): T {
  return JSON.parse(JSON.stringify(t));
}

/**
 * Removes all undefined or null properties
 * including the nested props too
 * as well as the ones in omit callbacks returning true
 */
export function removeEmpty(
  obj: Record<string, any>,
  omits?: ((v: any) => boolean)[]
) {
  const checkOmits = (v: any) => {
    if (omits) {
      for (const omit of omits) {
        if (omit(v)) return false;
      }
    }

    return true;
  };

  // TODO: define option for defining what to remove based on its type
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => (isNullOrUndefined(v) ? false : checkOmits(v)))
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v, omits) : v])
  );
}

export function isNullOrUndefined(o: any) {
  return o === null || o === undefined;
}

export function isBoolean(n: any): boolean {
  return !!n === n;
}

/**
 * Tries to get a value from a key in an object
 * @returns the value of the key or undefined
 */
export function getValue<T>(obj: Record<string, T>, key): T | undefined {
  if (obj && obj.hasOwnProperty(key)) return obj[key];

  return undefined;
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const saveAs = (file: FileModel): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', file.url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      const f = new Blob([xhr.response], { type: file.type });
      const a = document.createElement('a');
      a.setAttribute('download', lastSplit(file.key, '/') || 'file');
      a.href = window.URL.createObjectURL(f);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      resolve();
    };
    xhr.onerror = reject;
    xhr.send();
  });
};
