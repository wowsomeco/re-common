import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

import type { FormInputProps } from '~w-common/components/form/formInput';

import { withError } from './utils';

interface MaskedInputProps
  extends Omit<FormInputProps, 'defaultValue'>,
    Omit<
      NumberFormatProps,
      'name' | 'prefix' | 'suffix' | 'min' | 'max' | 'step'
    > {
  type?: 'text' | 'tel' | 'password';
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  name,
  rules,
  prefix,
  suffix,
  min,
  max,
  step,
  decimalSeparator = '.',
  decimalScale = 0,
  thousandSeparator = ',',
  required = false,
  defaultValue = null,
  inputMode = 'none',
  readOnly = false,
  ...other
}) => {
  const { errors, control } = useFormContext();
  const value: string | number | undefined = useWatch({
    control,
    name: name
  });

  return (
    <Controller
      rules={rules}
      name={name}
      defaultValue={defaultValue}
      render={(p) => {
        return (
          <NumberFormat
            {...other}
            InputLabelProps={{ required }}
            InputProps={{
              readOnly: readOnly,
              startAdornment: prefix,
              endAdornment: suffix,
              inputProps: {
                min,
                max,
                step,
                inputMode
              }
            }}
            name={name}
            value={value}
            onValueChange={(values) => {
              p.onChange(values.value);
            }}
            decimalScale={decimalScale}
            decimalSeparator={decimalSeparator}
            thousandSeparator={thousandSeparator}
            allowNegative={false}
            customInput={TextField}
            {...withError(name, errors)}
          />
        );
      }}
    />
  );
};

export default MaskedInput;
