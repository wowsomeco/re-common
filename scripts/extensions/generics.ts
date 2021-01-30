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
 * Removes all empty properties from an object
 * including the default values for each type
 * e.g. number with value 0 will be removed
 * string with value '' will get removed too
 */
export function removeEmpty(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  );
}
