import { TextField, TextFieldProps } from '@material-ui/core';
import { DatePicker, DatePickerProps } from '@material-ui/lab';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { FormFieldProps } from './common';
import { withError } from './utils';

export interface FormDatePickerProps
  extends Omit<FormFieldProps, 'onChange'>,
    Omit<DatePickerProps, 'value' | 'onChange' | 'renderInput'> {
  required?: boolean;
  onChange?: (v: Dayjs | undefined) => void;
  onLoad?: TextFieldProps['onLoad'];
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  rules,
  defaultValue = null,
  required = false,
  inputFormat = 'YYYY-MM-DD',
  disableFuture = false,
  onChange,
  onLoad,
  ...other
}) => {
  const { errors, control } = useFormContext();
  // watch the value
  const watchValue: number | undefined = useWatch({ control, name: name });
  // then set the DatePicker value accordingly
  // convert to dayjs object since we use AdapterDayjs as defined in home/index.tsx
  const value = watchValue ? dayjs(`${watchValue}`) : null;

  return (
    <Controller
      rules={rules}
      name={name}
      defaultValue={defaultValue}
      render={(p) => (
        <DatePicker
          {...other}
          inputFormat={inputFormat}
          disableFuture={disableFuture}
          value={value}
          onChange={(v?: Dayjs) => {
            // retrieve Dayjs obj onChange
            // format accordingly
            p.onChange(v?.format(inputFormat));

            onChange && onChange(v);
          }}
          //@ts-ignore
          inputRef={(ref) => {
            // @ts-ignore
            onLoad?.({ target: ref });
          }}
          renderInput={(props) => (
            <TextField
              {...props}
              {...withError(name, errors)}
              fullWidth
              InputLabelProps={{ required }}
              // inputRef={(ref) => {
              //   if (
              //     props?.ref &&
              //     typeof props?.ref === 'object' &&
              //     !Array.isArray(props?.ref) &&
              //     props?.ref !== null
              //   ) {
              //     // @ts-ignore
              //     props.ref.current = ref;
              //   }

              //   // @ts-ignore
              //   onLoad?.({ target: ref });
              // }}
              InputProps={{
                ...props.InputProps,
                readOnly: true
              }}
            />
          )}
        />
      )}
    />
  );
};

export interface FormYearPickerProps
  extends Omit<
    FormDatePickerProps,
    'inputFormat' | 'openTo' | 'views' | 'mask'
  > {}

export const FormYearPicker: React.FC<FormYearPickerProps> = (props) => {
  return (
    <FormDatePicker
      openTo='year'
      views={['year']}
      inputFormat='YYYY'
      mask='____'
      {...props}
    />
  );
};

export const FormMonthYearPicker: React.FC<FormYearPickerProps> = (props) => {
  return (
    <FormDatePicker
      openTo='year'
      views={['year', 'month']}
      inputFormat='YYYY-MM'
      mask='____-__'
      {...props}
    />
  );
};

export default FormDatePicker;
