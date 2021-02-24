import { isBetween } from '~w-common/scripts/extensions/numbers';

import { Validator } from './base';

export class ValidatorNumber extends Validator {
  static init(v: number | null): ValidatorNumber {
    return new ValidatorNumber(v);
  }

  positive(errMsg: string = 'must be positive'): ValidatorNumber {
    this.validate((v: number) => (v >= 0 ? undefined : errMsg));

    return this;
  }

  gt(other: number, errMsg: (n: number) => string): ValidatorNumber {
    this.validate((v: number) => (v > other ? undefined : errMsg(other)));

    return this;
  }

  between(
    min: number,
    max: number,
    errMsg: (min: number, max: number) => string
  ): ValidatorNumber {
    this.validate((v) => {
      const num = parseInt(v);
      if (Number.isFinite(num) && isBetween(num, min, max)) {
        return undefined;
      }

      return errMsg(min, max);
    });

    return this;
  }
}
