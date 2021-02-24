import { ValidatorDate } from '../validators/validatorDate';
import { ValidatorNumber } from '../validators/validatorNumber';
import { ValidatorString } from '../validators/validatorString';

const vNumber = (v: number | null): ValidatorNumber => ValidatorNumber.init(v);

describe('Validator Number tests', () => {
  test('must return error message when value is negative', () => {
    const errMsg = 'Value cannot be negative';
    const value = -1;
    const validator = vNumber(value).positive(errMsg).build();

    expect(validator).toBe(errMsg);
  });

  test('must return undefined when value is positive', () => {
    const value = 0;
    const validator = vNumber(value).positive().build();

    expect(validator).toBe(undefined);
  });

  test('must return undefined when optional', () => {
    const value = null;
    const validator = vNumber(value).positive().optional().build();

    expect(validator).toBe(undefined);
  });

  test('greater than test', () => {
    const value = 10;
    const validator = vNumber(value)
      .gt(50, (n) => `must be greater than ${n}`)
      .build();

    expect(validator).toBe('must be greater than 50');
  });
});

const vDate = (v: string | null): ValidatorDate => ValidatorDate.init(v);

describe('Validator Date tests', () => {
  test('check year validity', () => {
    const err = 'invalid';
    const value: string = '---1010';
    const validator = vDate(value).validDate('YYYY', err).build();
    expect(validator).toBe(err);

    const value2 = '2020';
    const validator2 = vDate(value2).validDate('YYYY', err).build();
    expect(validator2).toBe(undefined);
  });

  test('check date validity', () => {
    const err = 'invalid';
    const value: string = '50-50-1010';
    const validator = vDate(value).validDate('DD-MM-YYYY', err).build();
    expect(validator).toBe(err);

    const value2 = '10-10-2020';
    const validator2 = vDate(value2).validDate('YYYY-MM-DD', err).build();
    expect(validator2).toBe(err);

    const value3 = '2020-10-10';
    const validator3 = vDate(value3).validDate('YYYY-MM-DD', err).build();
    expect(validator3).toBe(undefined);
  });

  test('check date range validity', () => {
    const err = 'invalid';
    const value: string = '10-10-2010';
    const validator = vDate(value)
      .validRange({ min: '10-10-2010', max: '20-10-2010' }, err)
      .build();

    expect(validator).toBe(undefined);

    const value2: string = '10-10-2010';
    const validator2 = vDate(value2)
      .validRange({ min: '11-10-2010', max: '20-10-2010' }, err)
      .build();

    expect(validator2).toBe(err);

    const value3 = null;
    const validator3 = vDate(value3)
      .validRange({ min: '09-10-2010', max: '20-10-2010' }, err)
      .optional()
      .build();
    // dont validate when optional
    expect(validator3).toBe(undefined);

    const value4: string = '2010';
    const validator4 = vDate(value4)
      .validRange({ min: '2009', max: '2020' }, err)
      .build();

    expect(validator4).toBe(undefined);

    const value5 = null;
    const validator5 = vDate(value5)
      .validRange({ min: '09-10-2010', max: '20-10-2010' }, err)
      .build();

    expect(validator5).toBe(err);
  });

  test('must return undefined when value is null', () => {
    const value: string | null = null;
    const validator = vDate(value).validDate().optional().build();

    expect(validator).toBe(undefined);
  });
});

const vString = (v: string | null): ValidatorString => ValidatorString.init(v);

describe('Validator String tests', () => {
  test('check special character', () => {
    const errMsg = 'no special';
    const value = '111#$%1';
    const validator = vString(value).noSpecial({ accept: '-', errMsg }).build();

    expect(validator).toBe(errMsg);

    const value2 = '111-1-1111';
    const validator2 = vString(value2)
      .noSpecial({ accept: '-', errMsg })
      .build();

    expect(validator2).toBe(undefined);

    const value3 = '111*1()1111';
    const validator3 = vString(value3)
      .noSpecial({ accept: '*()', errMsg })
      .build();

    expect(validator3).toBe(undefined);
  });
});
