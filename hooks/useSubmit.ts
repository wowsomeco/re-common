import { responseNotif } from '~app/scripts/functions';
import { useNotifProvider } from '~w-common/contexts/notifContext';
import { Resp, useFetch } from '~w-common/hooks';
import { removeEmpty } from '~w-common/scripts';

import { HttpContentType } from './useHttp';

type OnSubmitProps<T> = {
  doSubmit: (model: T) => Promise<void>;
  loading: boolean;
};

type OnSubmitted<T> = ((resp: Resp<T>) => void) | undefined;

export interface SubmitOptions<T> {
  /** `true`: POST, `false`: PUT */
  isNew: boolean;
  /** The API endpoint */
  endpoint: string;
  /** if it's true, it will omit the empty fields out of the model */
  whitelist: boolean;
  /** `optional` callback returning the [[Resp]] data that is triggered once submitted */
  onSubmitted?: OnSubmitted<T>;
  /** object that will get merged to the submitted data prior to submitting */
  extraPayload?: Record<string, any>;
  /** callback of values in the payload that you want to omit by returning true for each of them */
  omit?: ((v: any) => boolean)[];
  contentType?: HttpContentType;
}

/**
 * Handles submitting logic to the backend
 * @see [[SubmitOptions]]
 */
const useSubmit = <T>(options: SubmitOptions<T>): OnSubmitProps<T> => {
  const {
    isNew,
    endpoint,
    whitelist,
    onSubmitted,
    extraPayload = {},
    omit,
    contentType = 'application/json'
  } = options;
  const { notif } = useNotifProvider();
  const { submit, loading } = useFetch<T>({
    method: isNew ? 'POST' : 'PUT',
    endpoint,
    contentType
  });

  const doSubmit = async (model: T) => {
    const payload = Object.assign(
      extraPayload,
      whitelist ? removeEmpty(model, omit) : model
    );

    const r = await submit({ body: payload });
    responseNotif(notif, r, isNew);
    onSubmitted?.(r);
  };

  return { doSubmit, loading };
};

export default useSubmit;
