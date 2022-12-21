import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import * as React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import NumberFormat, {
  NumberFormatProps,
  NumberFormatValues
} from 'react-number-format';

import type { FormInputProps } from '~w-common/components/form/formInput';

import { withError } from './utils';

export interface MaskedInputProps
  extends Omit<FormInputProps, 'defaultValue' | 'onChange'>,
    Omit<
      NumberFormatProps,
      | 'name'
      | 'prefix'
      | 'suffix'
      | 'min'
      | 'max'
      | 'step'
      | 'onChange'
      | 'size'
      | 'color'
    > {
  type?: 'text' | 'tel' | 'password';
  onChange?: (values: NumberFormatValues) => void;
  onLoad?: TextFieldProps['onLoad'];
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
  onChange,
  onLoad,
  ...other
}) => {
  const { errors, control } = useFormContext();
  const value: string | number | undefined = useWatch({
    control,
    name: name
  });

  // Mode Text Field Custom
  const TextFieldCustom = (props: TextFieldProps) => {
    return (
      <TextField
        {...props}
        inputRef={(ref) => {
          if (typeof props.inputRef == 'function') {
            props.inputRef(ref);
          } else {
            //@ts-ignore
            if (props.inputRef) props.inputRef.current = ref;
          }

          if (
            props?.ref &&
            typeof props?.ref === 'object' &&
            !Array.isArray(props?.ref) &&
            props?.ref !== null
          ) {
            // @ts-ignore
            props.ref.current = ref;
          }

          // @ts-ignore
          onLoad?.({ target: ref });
          ref && ref.focus();
        }}
      />
    );
  };

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

              onChange && onChange(values);
            }}
            decimalScale={decimalScale}
            decimalSeparator={decimalSeparator}
            thousandSeparator={thousandSeparator}
            allowNegative={false}
            customInput={TextFieldCustom}
            {...withError(name, errors)}
          />
        );
      }}
    />
  );
};

export default MaskedInput;
