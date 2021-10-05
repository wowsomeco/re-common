import { Autocomplete, CircularProgress, TextField } from '@material-ui/core';
import get from 'lodash.get';
import * as React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useMountedState } from 'react-use';

import { useStatelessFetchJson } from '~w-common/hooks';

import { FormFieldProps } from './common';
import { withError } from './utils';

export interface SelectEnumProps extends Omit<FormFieldProps, 'onChange'> {
  label: string;
  endpoint: string | null;
  disabled?: boolean;
  optionId?: string;
  optionName?: string;
  getOptionLabel?: (option?: EnumModel) => string;
  onChange?: (v: string | null) => void;
}

const DummyAutoComplete: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Autocomplete<string>
      fullWidth
      loading
      disabled
      options={[]}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};

type EnumModel = Record<string, any>;
interface EnumWithCount {
  data: EnumModel[];
  count: number;
}

export const FormSelectEnum: React.FC<SelectEnumProps> = ({
  name,
  rules,
  label,
  endpoint,
  disabled,
  optionId = 'id',
  optionName = 'name',
  getOptionLabel,
  onChange
}) => {
  const { submit } = useStatelessFetchJson<EnumWithCount | EnumModel[]>({
    method: 'GET',
    endpoint: endpoint || ''
  });

  const [result, setResult] = React.useState<EnumModel[]>([]);
  const [fetching, setFetching] = React.useState(true);
  const loading = fetching;

  const findNameById = (id: string) => {
    const find = result.find((x) => get(x, optionId) === id);

    // support custom name labeling, eg; combining multiple field value
    if (getOptionLabel) return getOptionLabel(find);

    return find ? get(find, optionName) : '';
  };

  const { control, errors } = useFormContext();

  const isMounted = useMountedState();

  React.useEffect(() => {
    (async () => {
      // fetch when endpoint is not null
      // otherwise, reset
      if (endpoint) {
        setFetching(true);
        const { data } = await submit();

        if (isMounted()) {
          setResult((data as EnumWithCount)?.data || data || []);
          setFetching(false);
        }
      } else {
        setResult([]);
      }
    })();
  }, [endpoint]);

  // need to render dummy on fetching,
  // otherwise the Textfield in Controller wont get updated when performing async action
  // might've been a bug with mui...
  // TODO: might want to refactor this later

  return fetching ? (
    <DummyAutoComplete label={label} />
  ) : (
    <Controller
      rules={rules}
      defaultValue={null}
      render={(props) => (
        <Autocomplete<string>
          fullWidth
          loading={loading}
          disabled={disabled}
          options={result.map((x) => get(x, optionId))}
          getOptionLabel={findNameById}
          renderInput={(params) => (
            <TextField
              {...params}
              {...withError(name, errors)}
              label={label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {fetching ? (
                      <CircularProgress color='primary' size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          )}
          {...props}
          onChange={(_, data) => {
            props.onChange(data);
            onChange?.(data);
          }}
        />
      )}
      name={name}
      control={control}
    />
  );
};

export interface SelectEnumLainnyaProps extends SelectEnumProps {
  lainnya: React.ReactNode;
  lainnyaId: string;
}

export const FormSelectEnumWithLainnya: React.FC<SelectEnumLainnyaProps> = ({
  lainnya,
  lainnyaId,
  ...props
}) => {
  const { control, setValue } = useFormContext();
  const watchValue = useWatch({ control, name: props.name });

  React.useEffect(() => {
    // whenever it's not `lainnya`, set lainnyaId to empty string
    if (watchValue !== 'lainnya' && watchValue !== '') {
      setValue(lainnyaId, '');
    }
  }, [watchValue]);

  return (
    <>
      <FormSelectEnum {...props} />
      {watchValue === 'lainnya' ? lainnya : null}
    </>
  );
};

export default FormSelectEnum;
