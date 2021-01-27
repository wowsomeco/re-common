import { useMemo } from 'react';

let counter = 0;

/**
 * This Hook returns an unique id every time its executed.
 * The generated id will be the same every time the component where
 * its called, is rendered.
 *
 * @param suffix text to be placed before the generated id
 */
export const useGenerateId = (suffix = '') => {
  const id = useMemo(() => ++counter, []);

  return `id-${suffix}${id}`;
};
