import Skeleton from '@material-ui/core/Skeleton';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAsync } from 'react-use';

import { Btn } from '~w-common/components/btn';
import { useStatelessFetchJson } from '~w-common/hooks';
import useReloadForm from '~w-common/hooks/useReloadForm';
import useSubmit from '~w-common/hooks/useSubmit';

interface FormTemplateProps {
  /** undefined means it's anew or an update if otherwise  */
  id?: number;
  /** Insert / Update endpoint */
  submitEndpoint: string;
  /** Get endpoint for fetching the data when it's an update */
  getEndpoint: string;
  /** The form field components */
  fields: (isNew: boolean, loading: boolean) => React.ReactNode;
  /** Additional Payload data that will be merged to the cur form fields payload on submit */
  extraPayload?: (isNew: boolean) => Record<string, any> | undefined;
  /** The route that will be redirected to if the [[getEndpoint]] returns 404 */
  notFoundRoute?: string;
}

/**
 * Wrapper for handling both Insert and Update form.
 */
const FormTemplate = <T extends Record<string, any>>(
  props: FormTemplateProps
) => {
  const {
    id,
    submitEndpoint,
    getEndpoint,
    fields,
    extraPayload,
    notFoundRoute = '/not-found'
  } = props;
  const isNew = id === undefined;
  const apiUrl = `${submitEndpoint}${isNew ? '' : `/${id}`}`;
  const { reload } = useReloadForm();
  // use submit hook
  const { doSubmit, loading } = useSubmit<T>({
    isNew,
    endpoint: apiUrl,
    whitelist: true,
    extraPayload: extraPayload?.(isNew),
    onSubmitted: reload
  });
  // hook form
  const methods = useForm({
    shouldUnregister: false
  });
  const { handleSubmit, reset } = methods;
  // fetch data if update
  const history = useHistory();
  const [fetching, setFetching] = React.useState<boolean>(!isNew);
  const { submit: get } = useStatelessFetchJson<T>({
    method: 'GET',
    endpoint: getEndpoint
  });
  useAsync(async () => {
    if (!isNew) {
      const { data, status } = await get();
      if (status === 404) {
        history.push(notFoundRoute);
      } else {
        reset(data);
        setFetching(false);
      }
    }
  }, []);

  return (
    <FormProvider {...methods}>
      {fetching ? (
        <div className='w-full'>
          <Skeleton />
          <Skeleton animation={false} />
          <Skeleton animation='wave' />
        </div>
      ) : (
        <form onSubmit={handleSubmit((v) => doSubmit(v as T))}>
          {fields(isNew, loading)}
          <div className='flex justify-end sticky bottom-0 right-0 py-5'>
            <Btn
              type='submit'
              variant='contained'
              color='primary'
              loading={loading}
            >
              {isNew ? 'Submit' : 'Update'}
            </Btn>
          </div>
        </form>
      )}
    </FormProvider>
  );
};

export default FormTemplate;
