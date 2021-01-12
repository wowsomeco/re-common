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

export function hexToRgb(hex: string): Record<string, number> | undefined {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : undefined;
}

export function toRgba(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  return `rgba(${[rgb.r, rgb.g, rgb.b].join(',')},${opacity})`;
}

export function subDomain(): string {
  return window.location.host.split('.')[0];
}