import get from 'lodash.get';
import * as React from 'react';
import { FieldError } from 'react-hook-form';

export interface withErrorReturn {
  /** when true, it will show the red border for the textfield */
  error: boolean;
  /** returns the error message text when error is true */
  helperText: React.ReactNode;
}

/**
 * Wrapper for TextField that can be attached to it and
 * handle the error state as well as helperText accordingly
 * e.g.
 * ```typescript
 * <TextField
 *  label='Kode Unik'
 *  {...withError('uniqueCode', errors)}
 * />
 * ```
 * @returns [[withErrorReturn]]
 */
export function withError<T extends Record<string, FieldError>>(
  name: string,
  errors: T
): withErrorReturn {
  const errMsg = get(errors, name)?.message || '';

  return {
    error: !!errMsg,
    helperText: errMsg
  };
}
