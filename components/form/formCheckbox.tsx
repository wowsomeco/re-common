import { Checkbox, FormControlLabel } from '@material-ui/core';
import * as React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { CommonProps } from '~w-common/components';

import { FormFieldProps } from './common';

export interface FormCheckboxProps extends CommonProps, FormFieldProps {
  label: (v: boolean) => string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  className,
  name,
  rules,
  defaultValue = null,
  label,
  onChange,
  ...props
}) => {
  const { control } = useFormContext();
  const v: boolean | undefined = useWatch({ control, name: name });

  return (
    <FormControlLabel
      className={className}
      label={label(v || false)}
      control={
        <Controller
          defaultValue={defaultValue}
          control={control}
          name={name}
          rules={rules}
          render={(controllerProps) => (
            <Checkbox
              checked={v || false}
              onChange={(e) => {
                controllerProps.onChange(e.target.checked);
                onChange && onChange(e);
              }}
              {...props}
            />
          )}
        />
      }
    />
  );
};

export default FormCheckbox;
