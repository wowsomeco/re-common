import get from 'lodash.get';
import * as React from 'react';
import {
  Controller,
  ControllerRenderProps,
  InputState,
  UseControllerOptions,
  useFormContext
} from 'react-hook-form';

interface RenderProps extends ControllerRenderProps {
  errorMessage?: string;
}

interface FormControllerProps extends UseControllerOptions {
  render: (props: RenderProps, state?: InputState) => React.ReactElement;
}

const FormController: React.FC<FormControllerProps> = ({
  name,
  rules,
  onFocus,
  render,
  defaultValue = ''
}) => {
  const { control, errors } = useFormContext();

  const errorMessage = get(errors, name)?.message;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      onFocus={onFocus}
      render={(props, state) => render({ errorMessage, ...props }, state)}
    />
  );
};

export default FormController;
