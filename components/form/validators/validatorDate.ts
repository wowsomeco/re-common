import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import { Validator } from './base';

interface DateRangeOption {
  min?: string | number | Date;
  max?: string | number | Date;
}

export class ValidatorDate extends Validator {
  static init(v: string | null): ValidatorDate {
    return new ValidatorDate(v);
  }

  validDate(
    format: string = 'YYYY-MM-DD',
    errMsg: string = 'Invalid Date'
  ): ValidatorDate {
    this.validate((v) => {
      return dayjs(v, format, true).isValid() ? undefined : errMsg;
    });
    return this;
  }

  validRange(
    options: DateRangeOption,
    errMsg: string = 'Invalid date'
  ): ValidatorDate {
    this.validate((v) => {
      const { min = '1900', max = Date.now() } = options;

      const minDate = dayjs(min);
      const maxDate = dayjs(max);
      const inputDate = dayjs(v);

      const isValidDate =
        inputDate.isSame(minDate) ||
        inputDate.isSame(maxDate) ||
        (inputDate.isAfter(minDate) && inputDate.isBefore(maxDate));

      return isValidDate ? undefined : errMsg;
    });

    return this;
  }
}
