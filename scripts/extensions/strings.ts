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
  return `rgba(${[rgb.r, rgb.g, rgb.b].join(',')},${opacity})`;
}

export function subDomain(): string {
  const firstDomain = window.location.host.split('.')[0];
  // removes the port along with its semicolon
  const withNoDigits = firstDomain.replace(/[0-9]/g, '');
  const outputString = withNoDigits.replace(/:([^:]*)$/, '$1');
  return outputString;
}
