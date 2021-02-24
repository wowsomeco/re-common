import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormFieldProps } from './common';
import { withError } from './utils';

// TODO: might want to extend TextFieldProps later
interface FormInputProps extends Omit<FormFieldProps, 'defaultValue'> {
  label: string;
  type?: React.InputHTMLAttributes<unknown>['type'];
  inputMode?: React.InputHTMLAttributes<unknown>['inputMode'];
  step?: any;
  min?: number;
  max?: number;
  required?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  prefix,
  suffix,
  name,
  label,
  min,
  max,
  step,
  type = 'text',
  inputMode = 'none',
  required = false,
  fullWidth = true,
  multiline = false,
  rules
}) => {
  const { register, errors } = useFormContext();

  return (
    <TextField
      name={name}
      inputRef={register(rules)}
      type={type}
      label={label}
      fullWidth={fullWidth}
      multiline={multiline}
      InputLabelProps={{ required }}
      InputProps={{
        startAdornment: prefix,
        endAdornment: suffix,
        inputProps: {
          min,
          max,
          step,
          inputMode
        }
      }}
      {...withError(name, errors)}
    />
  );
};

export default FormInput;
