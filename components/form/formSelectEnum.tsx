import {
  Autocomplete,
  AutocompleteProps,
  CircularProgress,
  TextField,
  TextFieldProps
} from '@material-ui/core';
import get from 'lodash.get';
import * as React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { useStatelessFetchJson } from '~w-common/hooks';
import { useSafeState } from '~w-common/hooks/useSafeState';

import { FormFieldProps } from './common';
import { withError } from './utils';

export interface SelectEnumPropsBase extends Omit<FormFieldProps, 'onChange'> {
  label: string;
  disabled?: boolean;
  optionId?: string;
  optionName?: string;
  getOptionLabel?: (option?: EnumModel, index?: number) => string;
  onChange?: (v: string | null) => void;
}

export interface SelectEnumProps extends SelectEnumPropsBase {
  endpoint: string | null;
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

export type EnumModel = Record<string, any>;
export interface EnumWithCount {
  data: EnumModel[];
  count: number;
}

export interface FormSelectEnumLocalProps extends SelectEnumPropsBase {
  options?: EnumModel[];
  loading?: boolean;
  onLoad?: AutocompleteProps<string, false, false, false>['onLoad'];
}

export const FormSelectEnumLocal: React.FC<FormSelectEnumLocalProps> = ({
  name,
  rules,
  label,
  options,
  loading,
  disabled,
  optionId = 'id',
  optionName = 'name',
  defaultValue = null,
  getOptionLabel,
  onChange,
  onLoad
}) => {
  const findNameById = (id: string) => {
    const findIndex = options?.findIndex((x) => {
      const findOptionId = get(x, optionId);
      return findOptionId == id;
    });
    const find =
      findIndex != null && findIndex >= 0 ? options?.[findIndex] : undefined;

    // support custom name labeling, eg; combining multiple field value
    if (getOptionLabel) return getOptionLabel(find, findIndex);

    return find ? get(find, optionName) : '';
  };

  const { control, errors } = useFormContext();

  // need to render dummy on fetching,
  // otherwise the Textfield in Controller wont get updated when performing async action
  // might've been a bug with mui...
  // TODO: might want to refactor this later

  return loading ? (
    <DummyAutoComplete label={label} />
  ) : (
    <Controller
      rules={rules}
      defaultValue={defaultValue}
      render={(props) => (
        <Autocomplete<string>
          fullWidth
          loading={loading}
          disabled={disabled}
          options={(options || []).map((x) => get(x, optionId))}
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
                    {loading ? (
                      <CircularProgress color='primary' size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          )}
          {...props}
          ref={(r) => {
            if (
              props?.ref &&
              typeof props?.ref === 'object' &&
              !Array.isArray(props?.ref) &&
              props?.ref !== null
            ) {
              props.ref.current = r;
            }

            // @ts-ignore
            onLoad?.({ target: r, value: props.value });
          }}
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

export const FormSelectEnum: React.FC<SelectEnumProps> = ({
  endpoint,
  ...props
}) => {
  const { submit } = useStatelessFetchJson<EnumWithCount | EnumModel[]>({
    method: 'GET',
    endpoint: endpoint || ''
  });

  const [result, setResult] = useSafeState<EnumModel[]>([]);
  const [fetching, setFetching] = useSafeState(true);
  const loading = fetching;

  React.useEffect(() => {
    (async () => {
      // fetch when endpoint is not null
      // otherwise, reset
      if (endpoint) {
        setFetching(true);
        const { data } = await submit();

        setResult((data as EnumWithCount)?.data || data || []);
        setFetching(false);
      } else {
        setResult([]);
      }
    })();
  }, [endpoint]);

  return <FormSelectEnumLocal options={result} loading={loading} {...props} />;
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
