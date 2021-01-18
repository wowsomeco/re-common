import { useCallback, useEffect, useRef, useState } from 'react';
import { useKey } from 'react-use';
import { KeyFilter } from 'react-use/lib/useKey';

export const useIsMounted = (): (() => boolean) => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return function cleanup(): void {
      isMounted.current = false;
    };
  }, []);
  const checker = useCallback((): boolean => {
    return isMounted.current;
  }, []);
  return checker;
};

/**
 * useState wrapped with useKey hook to disable the state when any of the given key is pressed 
 */
export const useStateWithKey = (v: boolean, key: KeyFilter = 'Escape'): [boolean, any] => {
  const [s, d] = useState(v);

  useKey(key, () => d(false));

  return [s, d];
};