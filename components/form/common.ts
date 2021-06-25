import { RegisterOptions } from 'react-hook-form';

export interface FormFieldProps {
  name: string;
  rules?: RegisterOptions;
  defaultValue?: any | null;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}
