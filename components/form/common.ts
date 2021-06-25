import { RegisterOptions } from 'react-hook-form';

export interface FormFieldProps {
  name: string;
  rules?: RegisterOptions;
  defaultValue?: any | null;
  // for rare use case like working with react-hook-form "watch" where
  // the "watch state" will return defaultValue if the field value is falsy
  // this will prevent react useEffect running if it depend on "watch state"
  // the only solution is by accessing the input value directly using onChange
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}
