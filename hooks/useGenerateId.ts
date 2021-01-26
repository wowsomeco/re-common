import { useMemo } from 'react';

let counter = 0;

export const useGenerateId = (suffix = '') => {
  const id = useMemo(() => ++counter, []);

  return `id-${suffix}${id}`;
};
