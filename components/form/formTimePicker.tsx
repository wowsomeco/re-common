import { TextField, TextFieldProps } from '@material-ui/core';
import { TimePicker, TimePickerProps } from '@material-ui/lab';
import dayjs, { Dayjs, UnitType } from 'dayjs';
import * as React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { FormFieldProps } from '~w-common/components/form/common';
import { withError } from '~w-common/components/form/utils';

interface FormTimePickerProps
  extends Omit<FormFieldProps, 'onChange'>,
    Omit<TimePickerProps, 'value' | 'onChange' | 'renderInput'> {
  required?: boolean;
  onChange?: (v: string) => void;
  onLoad?: TextFieldProps['onLoad'];
}

/**
 * Convert time string format into dayjs object
 * support from hour until milisecond
 */
export const getDayjsTime = (val?: string | null): Dayjs | null => {
  if (!val) return null;

  let result = dayjs();
  const split = val.split(':');

  // set hour, minute, second
  (['hour', 'minute', 'second', 'millisecond'] as UnitType[]).forEach(
    (timeUnit, i) => {
      // set to zero by default if time unit not exist in string
      if (!split[i]) {
        result = result.set(timeUnit, 0);
        return;
      }

      const time = Number(split[i]);
      if (!isNaN(time)) result = result.set(timeUnit, time);
      // set to zero by default if time invalid number
      else result = result.set(timeUnit, 0);
    }
  );

  return result;
};

const FormTimePicker: React.FC<FormTimePickerProps> = ({
  name,
  rules,
  defaultValue = null,
  required = false,
  inputFormat = 'HH:mm:ss',
  onChange,
  onLoad,
  ...other
}) => {
  const { errors, control } = useFormContext();
  // watch the value
  const watchValue: string | undefined = useWatch({ control, name: name });
  // then set the TimeValue value accordingly
  // convert to dayjs object since we use AdapterDayjs as defined in home/index.tsx
  const value = getDayjsTime(watchValue);

  return (
    <Controller
      rules={rules}
      name={name}
      defaultValue={defaultValue}
      render={(p) => (
        <TimePicker
          {...other}
          inputFormat={inputFormat}
          value={value}
          onChange={(v: Dayjs) => {
            const val = dayjs(v).format(inputFormat);
            p.onChange(val);
            onChange?.(val);
          }}
          // @ts-ignore
          inputRef={(ref) => {
            // @ts-ignore
            onLoad?.({ target: ref });
          }}
          renderInput={(props) => (
            <TextField
              {...props}
              {...withError(name, errors)}
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
              fullWidth
              InputLabelProps={{ required }}
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

export default FormTimePicker;
